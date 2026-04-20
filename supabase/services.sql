-- Services
-- Run in Supabase SQL editor after setup.sql

create table if not exists public.services (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  eyebrow          text not null default '',
  title            text not null,
  hero_description text not null default '',
  icon_name        text not null default 'Wrench',
  overview         text not null default '',
  features         text[] not null default '{}',
  process          jsonb not null default '[]',
  stats            jsonb not null default '[]',
  related_services text[] not null default '{}',
  meta_title       text not null default '',
  meta_description text not null default '',
  schema_json      jsonb,
  cta_eyebrow      text not null default 'Ready to Start?',
  cta_heading      text not null default 'Speak to a Trade Specialist Today',
  cta_body         text not null default 'Get a no-obligation quote for your next project. Our team responds within one business day.',
  cta_btn1_label   text not null default 'Request a Quote',
  cta_btn1_href    text not null default '/contact',
  cta_btn2_label   text not null default '1300 227 600',
  cta_btn2_href    text not null default 'tel:1300227600',
  display_order    integer not null default 0,
  is_published     boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists services_slug_idx          on public.services(slug);
create index if not exists services_display_order_idx on public.services(display_order);

alter table public.services enable row level security;

drop policy if exists "services_public_select" on public.services;
create policy "services_public_select" on public.services
  for select using (is_published = true);

drop policy if exists "services_admin_select" on public.services;
create policy "services_admin_select" on public.services
  for select using (auth.uid() is not null);

drop policy if exists "services_admin_insert" on public.services;
create policy "services_admin_insert" on public.services
  for insert with check (auth.uid() is not null);

drop policy if exists "services_admin_update" on public.services;
create policy "services_admin_update" on public.services
  for update using (auth.uid() is not null);

drop policy if exists "services_admin_delete" on public.services;
create policy "services_admin_delete" on public.services
  for delete using (auth.uid() is not null);

create or replace function public.services_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at
  before update on public.services
  for each row execute function public.services_set_updated_at();

-- ============================================================
-- Seed: 6 services from hardcoded site data
-- ============================================================
insert into public.services (
  slug, eyebrow, title, hero_description, icon_name, overview,
  features, process, stats, related_services,
  meta_title, meta_description, schema_json,
  cta_eyebrow, cta_heading, cta_body,
  cta_btn1_label, cta_btn1_href, cta_btn2_label, cta_btn2_href,
  display_order, is_published
) values

(
  'commercial-air-conditioning',
  'HVAC Installation',
  'Commercial Air Conditioning',
  'End-to-end design, supply, and installation of commercial HVAC systems — built for offices, retail centres, hospitals, and industrial facilities across QLD and NSW.',
  'Wind',
  'HVACR Group delivers commercial air conditioning projects from initial load calculation through to commissioning and handover. Our engineers size and specify systems that match your building''s thermal profile, occupancy patterns, and energy targets — then our licensed technicians install and commission to manufacturer standards.',
  ARRAY[
    'Ducted & split system installations',
    'VRF/VRV multi-zone systems',
    'Building management system (BMS) integration',
    'Energy efficiency assessments & NABERS advice',
    'Ceiling cassette & concealed units',
    'Roof-mounted package units & chillers',
    'Air handling units (AHUs) & FCUs',
    'Ventilation & fresh-air systems'
  ],
  '[
    {"step":"01","title":"Site Assessment","description":"We visit your site, review architectural drawings, and conduct a full thermal load calculation to establish system requirements."},
    {"step":"02","title":"System Design & Specification","description":"Our engineers produce a detailed design with equipment schedules, duct layouts, and energy performance estimates."},
    {"step":"03","title":"Supply & Installation","description":"We procure commercial-grade equipment and manage installation with our licensed HVAC technicians — on time, on budget."},
    {"step":"04","title":"Commissioning & Handover","description":"Every system is commissioned, tested, and balanced to design intent before we hand over documentation and warranties."}
  ]'::jsonb,
  '[{"value":"50+","label":"Years combined experience"},{"value":"QLD & NSW","label":"Service coverage"},{"value":"QBCC","label":"Licensed contractor"}]'::jsonb,
  ARRAY['preventative-maintenance','industrial-cooling-systems','emergency-repairs'],
  'Commercial Air Conditioning | HVACR Group',
  'Commercial HVAC design, supply, and installation across QLD & NSW — ducted, VRF/VRV, BMS integration, and energy-efficient systems for offices, retail, and industrial sites.',
  '{"@context":"https://schema.org","@type":"Service","name":"Commercial Air Conditioning","url":"https://hvacrgroup.com.au/services/commercial-air-conditioning","description":"End-to-end commercial HVAC design, supply, and installation across Queensland and New South Wales.","serviceType":"Commercial Air Conditioning Installation","provider":{"@type":"Organization","name":"HVACR Group","url":"https://hvacrgroup.com.au","telephone":"+611300227600"}}'::jsonb,
  'Ready to Start?', 'Speak to a Trade Specialist Today',
  'Get a no-obligation quote for your next project. Our team responds within one business day.',
  'Request a Quote', '/contact', '1300 227 600', 'tel:1300227600',
  0, true
),

(
  'commercial-refrigeration',
  'Refrigeration Solutions',
  'Commercial Refrigeration',
  'Full-scope refrigeration solutions for supermarkets, food processors, distribution centres, and hospitality — ARCtick certified across all refrigerant types.',
  'Snowflake',
  'Our commercial refrigeration teams handle everything from display case fit-outs to large-scale remote condensing plants. With ARCtick certification and decades of experience across food retail, food processing, and hospitality, we design and install systems that keep product safe and energy costs down.',
  ARRAY[
    'Display case & coolroom fit-outs',
    'Remote condensing unit installations',
    'Low-temperature freezer systems',
    'Multi-deck & island display cabinets',
    'Refrigerant management & handling',
    'Supermarket & food retail systems',
    'Hospitality bar & cellar cooling',
    'Food processing refrigeration plants'
  ],
  '[
    {"step":"01","title":"Needs Analysis","description":"We assess your product range, storage volumes, and facility layout to determine the right refrigeration approach and capacity."},
    {"step":"02","title":"Design & Specification","description":"Full refrigeration design including pipework schematics, electrical layouts, and equipment selection tailored to your site."},
    {"step":"03","title":"Installation & Fit-Out","description":"ARCtick certified technicians carry out all installation work — piping, electrical, case fitting, and plant room setup."},
    {"step":"04","title":"Commissioning & Compliance","description":"System commissioned to design parameters with full refrigerant logbooks, compliance certificates, and operator training."}
  ]'::jsonb,
  '[{"value":"ARCtick","label":"Certified technicians"},{"value":"All types","label":"Refrigerant handling"},{"value":"24/7","label":"Emergency support"}]'::jsonb,
  ARRAY['cold-room-construction','preventative-maintenance','emergency-repairs'],
  'Commercial Refrigeration | HVACR Group',
  'ARCtick certified commercial refrigeration installation across QLD & NSW — display cases, coolroom fit-outs, remote condensing units, and food retail systems.',
  '{"@context":"https://schema.org","@type":"Service","name":"Commercial Refrigeration","url":"https://hvacrgroup.com.au/services/commercial-refrigeration","description":"Full-scope commercial refrigeration solutions for supermarkets, food processors, and hospitality venues across Queensland and New South Wales.","serviceType":"Commercial Refrigeration Installation","provider":{"@type":"Organization","name":"HVACR Group","url":"https://hvacrgroup.com.au","telephone":"+611300227600"}}'::jsonb,
  'Ready to Start?', 'Speak to a Trade Specialist Today',
  'Get a no-obligation quote for your next project. Our team responds within one business day.',
  'Request a Quote', '/contact', '1300 227 600', 'tel:1300227600',
  1, true
),

(
  'cold-room-construction',
  'Cold Storage',
  'Cold Room Construction',
  'Custom-engineered cold rooms and freezer rooms built to your exact specifications — from panel selection to refrigeration plant, end-to-end.',
  'Building2',
  'We design and construct walk-in coolrooms and freezer rooms for food manufacturers, distributors, caterers, and retailers. Every build is engineered around your temperature requirements, product load, and HACCP obligations — with insulated panel systems, purpose-designed refrigeration, and full commissioning included.',
  ARRAY[
    'Walk-in coolrooms & freezer rooms',
    'Custom insulated panel systems',
    'HACCP-compliant construction',
    'Blast chiller & shock freezer integration',
    'Temperature monitoring systems',
    'Coolroom door & hardware supply',
    'Flooring, shelving & racking fit-out',
    'Refrigeration plant & controls'
  ],
  '[
    {"step":"01","title":"Consultation & Design Brief","description":"We gather your temperature spec, product volumes, access requirements, and HACCP obligations to establish the design brief."},
    {"step":"02","title":"Engineering & Panel Selection","description":"Our team engineers the structure, selects insulation thickness, and specifies panel systems for your required temperature range."},
    {"step":"03","title":"Construction & Fit-Out","description":"Full construction including panel erection, refrigeration installation, electrical, doors, flooring, and internal fit-out."},
    {"step":"04","title":"Commissioning & Handover","description":"Temperature stability testing, regulatory compliance checks, operator training, and full handover documentation."}
  ]'::jsonb,
  '[{"value":"HACCP","label":"Compliant designs"},{"value":"End-to-end","label":"Design & construct"},{"value":"Custom","label":"Every project"}]'::jsonb,
  ARRAY['commercial-refrigeration','preventative-maintenance','emergency-repairs'],
  'Cold Room Construction | HVACR Group',
  'Custom cold room and freezer room construction across QLD & NSW — HACCP-compliant designs, insulated panel systems, and full refrigeration installation.',
  '{"@context":"https://schema.org","@type":"Service","name":"Cold Room Construction","url":"https://hvacrgroup.com.au/services/cold-room-construction","description":"Custom cold room and freezer room design and construction for food manufacturers, distributors, and retailers across Queensland and New South Wales.","serviceType":"Cold Room Construction","provider":{"@type":"Organization","name":"HVACR Group","url":"https://hvacrgroup.com.au","telephone":"+611300227600"}}'::jsonb,
  'Ready to Start?', 'Speak to a Trade Specialist Today',
  'Get a no-obligation quote for your next project. Our team responds within one business day.',
  'Request a Quote', '/contact', '1300 227 600', 'tel:1300227600',
  2, true
),

(
  'preventative-maintenance',
  'Service Agreements',
  'Preventative Maintenance',
  'Scheduled maintenance programs that extend equipment life, reduce energy costs, and prevent costly breakdowns — tailored for single sites or national portfolios.',
  'Wrench',
  'Our planned maintenance programs keep your HVAC and refrigeration assets performing at peak efficiency year-round. We build maintenance schedules around your equipment profile, operational hours, and compliance requirements — then deliver against them with documented records and performance reports you can act on.',
  ARRAY[
    'Planned maintenance schedules',
    'Filter, coil & fan servicing',
    'Refrigerant leak testing',
    'Electrical safety checks',
    'Performance & energy reporting',
    'Compliance documentation',
    'National portfolio management',
    'Priority response for agreement clients'
  ],
  '[
    {"step":"01","title":"Asset Register & Audit","description":"We audit your existing equipment, capture condition data, and build an asset register that forms the basis of your service agreement."},
    {"step":"02","title":"Maintenance Schedule Design","description":"We develop a tailored maintenance schedule aligned with manufacturer requirements, regulatory obligations, and your operational needs."},
    {"step":"03","title":"Scheduled Service Visits","description":"Our technicians attend on the agreed schedule, complete all service tasks, and capture condition notes in your service records."},
    {"step":"04","title":"Reporting & Review","description":"Regular performance reports highlight trends, flag ageing assets, and inform capital planning before breakdowns occur."}
  ]'::jsonb,
  '[{"value":"Single site","label":"To national portfolio"},{"value":"Priority","label":"Response for clients"},{"value":"Full","label":"Compliance documentation"}]'::jsonb,
  ARRAY['commercial-air-conditioning','commercial-refrigeration','emergency-repairs'],
  'Preventative Maintenance | HVACR Group',
  'HVAC and refrigeration preventative maintenance programs across QLD & NSW — planned service agreements, compliance documentation, and priority emergency response.',
  '{"@context":"https://schema.org","@type":"Service","name":"Preventative Maintenance","url":"https://hvacrgroup.com.au/services/preventative-maintenance","description":"Scheduled HVAC and refrigeration maintenance programs for single sites and national portfolios across Queensland and New South Wales.","serviceType":"HVAC Preventative Maintenance","provider":{"@type":"Organization","name":"HVACR Group","url":"https://hvacrgroup.com.au","telephone":"+611300227600"}}'::jsonb,
  'Ready to Start?', 'Speak to a Trade Specialist Today',
  'Get a no-obligation quote for your next project. Our team responds within one business day.',
  'Request a Quote', '/contact', '1300 227 600', 'tel:1300227600',
  3, true
),

(
  'industrial-cooling-systems',
  'Industrial Solutions',
  'Industrial Cooling Systems',
  'Heavy-duty process cooling for manufacturing, pharmaceutical, mining, and data centre environments — engineered to handle the toughest thermal loads.',
  'Thermometer',
  'When standard HVAC isn''t enough, HVACR Group engineers industrial process cooling solutions that operate reliably in demanding environments. From glycol chiller systems and cooling towers to precision data centre cooling, we design, supply, and install plant that keeps your processes within tolerance — around the clock.',
  ARRAY[
    'Process chillers & cooling towers',
    'Glycol & brine cooling systems',
    'Data centre precision cooling (CRAC/CRAH)',
    'Adiabatic & evaporative coolers',
    'Industrial heat exchangers',
    'Pharmaceutical cleanroom cooling',
    'Mining & heavy industry systems',
    'Custom controls & SCADA integration'
  ],
  '[
    {"step":"01","title":"Process Heat Load Analysis","description":"We work with your engineering team to quantify process heat loads, identify cooling constraints, and establish performance targets."},
    {"step":"02","title":"System Engineering","description":"Our engineers design a purpose-built cooling solution — including plant selection, piping schematics, and controls architecture."},
    {"step":"03","title":"Supply & Installation","description":"Equipment procurement, site installation, and interconnection of mechanical, electrical, and controls systems by our industrial teams."},
    {"step":"04","title":"Commissioning & Optimisation","description":"Factory and site commissioning, performance validation against design intent, and ongoing optimisation support."}
  ]'::jsonb,
  '[{"value":"24/7","label":"Operational reliability"},{"value":"Custom","label":"Engineering design"},{"value":"Multi-sector","label":"Industry experience"}]'::jsonb,
  ARRAY['commercial-air-conditioning','preventative-maintenance','emergency-repairs'],
  'Industrial Cooling Systems | HVACR Group',
  'Industrial process cooling design and installation across QLD & NSW — chillers, cooling towers, glycol systems, and data centre precision cooling.',
  '{"@context":"https://schema.org","@type":"Service","name":"Industrial Cooling Systems","url":"https://hvacrgroup.com.au/services/industrial-cooling-systems","description":"Heavy-duty industrial process cooling solutions for manufacturing, pharmaceutical, mining, and data centre environments across Queensland and New South Wales.","serviceType":"Industrial Cooling System Installation","provider":{"@type":"Organization","name":"HVACR Group","url":"https://hvacrgroup.com.au","telephone":"+611300227600"}}'::jsonb,
  'Ready to Start?', 'Speak to a Trade Specialist Today',
  'Get a no-obligation quote for your next project. Our team responds within one business day.',
  'Request a Quote', '/contact', '1300 227 600', 'tel:1300227600',
  4, true
),

(
  'emergency-repairs',
  '24/7 Response',
  'Emergency Repairs',
  '24/7 emergency response for HVAC and refrigeration breakdowns — because when systems fail, every hour of downtime costs your business.',
  'Zap',
  'HVACR Group''s rapid-response teams are available around the clock for emergency call-outs across QLD and NSW. Whether it''s a failed refrigeration plant overnight, an air conditioning system down during a heatwave, or a cold room temperature alarm, we dispatch experienced technicians fast — and we carry a broad range of spare parts and loan equipment to get you running again.',
  ARRAY[
    '24/7 call-out availability',
    'Same-day response target',
    'All major brands serviced',
    'Loan equipment available',
    'Refrigerant emergency supply',
    'QLD & NSW coverage',
    'Priority access for maintenance clients',
    'Post-repair inspection & reporting'
  ],
  '[
    {"step":"01","title":"Call or Lodge Online","description":"Contact our 24/7 emergency line or submit an online request. Our dispatch team assesses urgency and mobilises the right technician."},
    {"step":"02","title":"Rapid Dispatch","description":"We target same-day response for critical failures. Our technicians carry common spares to maximise first-visit fix rates."},
    {"step":"03","title":"Diagnosis & Repair","description":"Our technician diagnoses the fault, provides a clear scope and cost estimate, and carries out repairs with your approval."},
    {"step":"04","title":"Post-Repair Report","description":"You receive a written service report covering fault cause, work performed, parts used, and any follow-up recommendations."}
  ]'::jsonb,
  '[{"value":"24/7","label":"Available year-round"},{"value":"Same day","label":"Response target"},{"value":"QLD & NSW","label":"Coverage area"}]'::jsonb,
  ARRAY['preventative-maintenance','commercial-refrigeration','commercial-air-conditioning'],
  'Emergency HVAC & Refrigeration Repairs | HVACR Group',
  '24/7 emergency HVAC and refrigeration repairs across QLD & NSW — same-day response, all major brands, loan equipment available.',
  '{"@context":"https://schema.org","@type":"Service","name":"Emergency Repairs","url":"https://hvacrgroup.com.au/services/emergency-repairs","description":"24/7 emergency HVAC and refrigeration repair service across Queensland and New South Wales with same-day response targets.","serviceType":"Emergency HVAC Repair","provider":{"@type":"Organization","name":"HVACR Group","url":"https://hvacrgroup.com.au","telephone":"+611300227600"}}'::jsonb,
  'Ready to Start?', 'Speak to a Trade Specialist Today',
  'Get a no-obligation quote for your next project. Our team responds within one business day.',
  'Request a Quote', '/contact', '1300 227 600', 'tel:1300227600',
  5, true
)

on conflict (slug) do nothing;
