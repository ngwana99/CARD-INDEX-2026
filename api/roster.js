const { createClient } = require('@supabase/supabase-js');

// snake_case Postgres column -> camelCase form field
const COLUMN_MAP = {
  fullName: 'full_name', matNo: 'mat_no', dob: 'dob', pob: 'pob', sex: 'sex',
  maritalStatus: 'marital_status', ethnicGroup: 'ethnic_group', firstLanguage: 'first_language',
  regionOrigin: 'region_origin', divisionOrigin: 'division_origin', subdivisionOrigin: 'subdivision_origin',
  employmentStatus: 'employment_status', dateEntryPublicService: 'date_entry_public_service',
  certAccessPublicService: 'cert_access_public_service', lastCertificate: 'last_certificate',
  certDegreeLevel: 'cert_degree_level', grade: 'grade',
  longevityOfService: 'longevity_of_service', echelon: 'echelon',
  salaryIndex: 'salary_index', careerIndex: 'career_index', weeklyWorkload: 'weekly_workload',
  regionWork: 'region_work', divisionWork: 'division_work', subdivisionWork: 'subdivision_work',
  placeOfWork: 'place_of_work', dutyPost: 'duty_post', dateEntryPresentPosition: 'date_entry_present_position',
  phone: 'phone', whatsapp: 'whatsapp',
  redeployed: 'redeployed', placeRedeployment: 'place_redeployment',
  divisionRedeployment: 'division_redeployment', subdivisionRedeployment: 'subdivision_redeployment',
};

function fromRow(row) {
  const data = { id: row.id, submittedAt: row.submitted_at };
  Object.entries(COLUMN_MAP).forEach(([camel, col]) => { data[camel] = row[col] ?? ''; });
  return data;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const code = (req.query && req.query.code) || '';
  if (!process.env.ADMIN_ACCESS_CODE || code !== process.env.ADMIN_ACCESS_CODE) {
    res.status(401).json({ error: 'Incorrect access code' });
    return;
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({ error: 'Server is missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY environment variables.' });
    return;
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error } = await supabase
      .from('card_index_submissions')
      .select('*')
      .order('submitted_at', { ascending: true });
    if (error) throw error;
    res.status(200).json((data || []).map(fromRow));
  } catch (e) {
    res.status(500).json({ error: e.message || 'Could not load the register' });
  }
};
