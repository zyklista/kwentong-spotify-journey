-- Update the send_to_sendernet function to handle tables without message column
CREATE OR REPLACE FUNCTION public.send_to_sendernet()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    payload jsonb;
    resp    jsonb;
    message_text text := '';
BEGIN
    -- Try to get message if column exists, otherwise use empty string
    BEGIN
        EXECUTE format('SELECT ($1).%I', 'message') INTO message_text USING NEW;
    EXCEPTION
        WHEN undefined_column THEN
            message_text := '';
    END;

    -- Build the JSON payload to send to Sender.net
    payload := jsonb_build_object(
        'email',   NEW.email,
        'name',    NEW.name,
        'message', message_text
    );

    -- Issue the HTTP POST via pg_net
    resp := net.http_post(
        'https://api.sender.net/v1/collect',
        payload,
        'application/json',
        jsonb_build_object(
            'Authorization',
            'Bearer ' || current_setting('app.sendernet_api_key')
        )
    );

    -- Store the request/response for debugging
    INSERT INTO public.sendernet_log(table_name, payload, response)
    VALUES (TG_TABLE_NAME, payload, resp);

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Sender.net request failed: %', sqlerrm;
        INSERT INTO public.sendernet_log(table_name, payload, response)
        VALUES (TG_TABLE_NAME, payload, jsonb_build_object('error', sqlerrm));
        RETURN NEW;
END;
$function$;