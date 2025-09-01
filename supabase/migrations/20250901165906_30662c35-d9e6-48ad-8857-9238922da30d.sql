-- Fix the send_to_sendernet function to handle payload properly and update sender.net URL
CREATE OR REPLACE FUNCTION public.send_to_sendernet()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    payload jsonb;
    resp    jsonb;
BEGIN
    -- Build payload based on table and available columns
    IF TG_TABLE_NAME = 'ebook_signups' THEN
        payload := jsonb_build_object(
            'email', NEW.email,
            'name', COALESCE(NEW.name, ''),
            'source', 'ebook_signup'
        );
    ELSIF TG_TABLE_NAME = 'contact_submissions' THEN
        payload := jsonb_build_object(
            'email', NEW.email,
            'name', NEW.name,
            'message', COALESCE(NEW.message, ''),
            'phone', COALESCE(NEW.phone, ''),
            'service', COALESCE(NEW.service, ''),
            'source', 'contact_form'
        );
    ELSE
        -- Default payload for other tables
        payload := jsonb_build_object(
            'email', NEW.email,
            'name', COALESCE(NEW.name, ''),
            'source', TG_TABLE_NAME
        );
    END IF;

    -- Make sure payload is never null
    IF payload IS NULL THEN
        payload := jsonb_build_object('error', 'No data to send');
    END IF;

    -- Call updated sender.net API v2 endpoint
    resp := net.http_post(
        'https://api.sender.net/v2/subscribers',
        payload,
        'application/json',
        jsonb_build_object(
            'Authorization',
            'Bearer ' || current_setting('app.sendernet_api_key', true)
        )
    );

    INSERT INTO public.sendernet_log(table_name, payload, response)
    VALUES (TG_TABLE_NAME, payload, resp);

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