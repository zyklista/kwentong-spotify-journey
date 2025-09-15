const SERVICE_MAPPING: Record<string, string> = {
  'admin-tasks': 'Administrative Tasks',
  'data-entry': 'Data Entry',
  'customer-service': 'Customer Service',
  'digital-marketing': 'Digital Marketing',
  'content-creation': 'Content Creation',
  'web-development': 'Website Development',
  'other': 'Other Services'
};

async function handleSubmit(formValues) {
  const mappedService = SERVICE_MAPPING[formValues.service] || formValues.service || 'Other Services';

  const payload = {
    name: formValues.name,
    email: formValues.email,
    phone: formValues.phone || null,
    service: mappedService,
    message: formValues.message,
    others: formValues.others || null
  };

  const res = await fetch(
    'https://yvmqcqrewqvwroxinzvn.supabase.co/functions/v1/contact_submissions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bXFjcXJld3F2d3JveGluenZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxMDEsImV4cCI6MjA3MjgxMDEwMX0.R0dPQK8ELH3OXmwxbJaEMa2CIU4E6G0hWEwj-sKK9Vc'
      },
      body: JSON.stringify(payload)
    }
  );

  if (!res.ok) {
    // handle error
    const error = await res.json();
    alert(error.error || 'Submission failed.');
    return;
  }

  alert('Form submitted successfully!');
}
