-- Fix security warnings by setting proper search_path on functions

-- Update push_to_make function with proper search_path
CREATE OR REPLACE FUNCTION public.push_to_make()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM supabase_functions.invoke(
    'push-to-make',
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'row',   row_to_json(NEW)::jsonb
    )
  );
  RETURN NEW;
END;
$function$;

-- Update push_to_sender function with proper search_path
CREATE OR REPLACE FUNCTION public.push_to_sender()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM supabase_functions.invoke(
    'push-to-sender',
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'row',   row_to_json(NEW)::jsonb
    )
  );
  RETURN NEW;
END;
$function$;