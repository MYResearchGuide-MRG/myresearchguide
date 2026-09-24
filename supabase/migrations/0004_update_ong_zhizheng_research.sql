-- Keep the DB-backed public researcher directory in sync with the source profile.
update public.researcher_profiles as rp
set research = 'Quantum Information / Biophysics'
from public.profiles as p
where rp.profile_id = p.id
  and p.name = 'Ong Zhi Zheng';
