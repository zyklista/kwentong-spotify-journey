-- Fix the send_to_sendernet function to properly handle JSON and HTTP headers
CREATE OR REPLACE FUNCTION public.send_to_sendernet()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    payload jsonb;
    headers jsonb;
    resp    jsonb;
    api_key text;
BEGIN
    -- Get the API key
    BEGIN
        api_key := current_setting('app.sendernet_api_key', true);
        IF api_key IS NULL OR api_key = '' THEN
            RAISE EXCEPTION 'SENDERNET_API_KEY not configured';
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            api_key := '';
    END;

    -- Build payload based on table and available columns
    IF TG_TABLE_NAME = 'ebook_signups' THEN
        payload := jsonb_build_object(
            'email', COALESCE(NEW.email, ''),
            'firstName', COALESCE(NEW.name, ''),
            'groups', jsonb_build_array('ebook-subscribers')
        );
    ELSIF TG_TABLE_NAME = 'contact_submissions' THEN
        payload := jsonb_build_object(
            'email', COALESCE(NEW.email, ''),
            'firstName', COALESCE(NEW.name, ''),
            'groups', jsonb_build_array('contact-leads'),
            'fields', jsonb_build_object(
                'message', COALESCE(NEW.message, ''),
                'phone', COALESCE(NEW.phone, ''),
                'service', COALESCE(NEW.service, '')
            )
        );
    ELSIF TG_TABLE_NAME = 'email_list' THEN
        payload := jsonb_build_object(
            'email', COALESCE(NEW.email, ''),
            'firstName', COALESCE(NEW.name, ''),
            'groups', jsonb_build_array('general-subscribers')
        );
    ELSE
        -- Default payload for other tables
        payload := jsonb_build_object(
            'email', COALESCE(NEW.email, ''),
            'firstName', COALESCE(NEW.name, ''),
            'groups', jsonb_build_array('general-subscribers')
        );
    END IF;

    -- Make sure payload is never null
    IF payload IS NULL THEN
        payload := jsonb_build_object('error', 'No data to send');
    END IF;

    -- Build headers
    headers := jsonb_build_object(
        'Authorization', 'Bearer ' || api_key,
        'Content-Type', 'application/json'
    );

    -- Only make HTTP call if API key is configured
    IF api_key != '' THEN
        BEGIN
            -- Call sender.net API v2 endpoint
            SELECT content INTO resp FROM http((
                'POST',
                'https://api.sender.net/v2/subscribers',
                headers,
                'application/json',
                payload::text
            )::http_request);
        EXCEPTION
            WHEN OTHERS THEN
                resp := jsonb_build_object('error', 'HTTP request failed: ' || sqlerrm);
        END;
    ELSE
        resp := jsonb_build_object('error', 'API key not configured');
    END IF;

    -- Log the attempt
    INSERT INTO public.sendernet_log(table_name, payload, response)
    VALUES (TG_TABLE_NAME, payload, COALESCE(resp, jsonb_build_object('error', 'No response')));

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Ensure we always have a non-null payload in the log
        IF payload IS NULL THEN
            payload := jsonb_build_object('error', 'Function error before payload creation');
        END IF;
        
        INSERT INTO public.sendernet_log(table_name, payload, response)
        VALUES (TG_TABLE_NAME, payload, jsonb_build_object('error', sqlerrm));
        RETURN NEW;
END;
$function$