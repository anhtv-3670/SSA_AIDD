-- Default test account for local development.
-- Runs automatically on `supabase start` / `supabase db reset` (see [db.seed] in config.toml).
--
-- Credentials (email + password login succeeds out of the box):
--   Email:    test@example.com
--   Password: password123
--
-- This seed is for LOCAL ONLY. Never run it against a real/production database.

-- =============================================================================
-- SECTION 1: Static catalogs
-- Safe to run first (no FK to auth.users).
-- =============================================================================

-- --- departments (5) ---------------------------------------------------------
-- Idempotent: delete/re-insert by PK.
delete from public.departments where code in ('CECV10','CEVC10','DXD01','PMG02','HRD01');

insert into public.departments (code, name) values
  ('CECV10', 'Customer Experience & Creative Vietnam 10'),
  ('CEVC10', 'Customer Experience & Value Creation 10'),
  ('DXD01',  'Digital Transformation Design 01'),
  ('PMG02',  'Product Management Group 02'),
  ('HRD01',  'Human Resources Department 01');

-- --- hashtags (9) ------------------------------------------------------------
-- identity column: use OVERRIDING SYSTEM VALUE with fixed ids for idempotency.
delete from public.hashtags where tag in (
  '#Dedicated','#Inspiring','#Teamwork','#Leadership','#Technical',
  '#Communication','#Mentoring','#Innovation','#Supportive'
);

insert into public.hashtags (id, tag) overriding system value values
  (1, '#Dedicated'),
  (2, '#Inspiring'),
  (3, '#Teamwork'),
  (4, '#Leadership'),
  (5, '#Technical'),
  (6, '#Communication'),
  (7, '#Mentoring'),
  (8, '#Innovation'),
  (9, '#Supportive');

-- --- hero_tiers (4) ----------------------------------------------------------
delete from public.hero_tiers where id in (1,2,3,4);

insert into public.hero_tiers (id, name, min_received, max_received, color) values
  (1, 'New Hero',    1,  4,    '#A8D8A8'),
  (2, 'Rising Hero', 5,  9,    '#FFD700'),
  (3, 'Super Hero',  10, 20,   '#FF6B35'),
  (4, 'Legend Hero', 21, null, '#C0392B');

-- --- awards (6) --------------------------------------------------------------
delete from public.awards where id in (
  'top-talent','top-project','top-project-leader','best-manager','signature-creator','mvp'
);

insert into public.awards (id, name, description, quantity, prize_value, ring_color, image, sort_idx) values
  (
    'top-talent',
    'Top Talent',
    'Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể.',
    '10 Đơn vị',
    '7.000.000 VNĐ cho mỗi giải thưởng',
    '#FAE287',
    '/saa-2025/medallion-top-talent.png',
    1
  ),
  (
    'top-project',
    'Top Project',
    'Giải thưởng Top Project vinh danh các tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng, hiệu quả vận hành tối ưu và tinh thần làm việc tận tâm. Đây là các dự án có độ phức tạp kỹ thuật cao, hiệu quả tối ưu hóa nguồn lực và chi phí tốt, đề xuất các ý tưởng có giá trị cho khách hàng, đem lại lợi nhuận vượt trội và nhận được phản hồi tích cực từ khách hàng. Các thành viên tuân thủ nghiêm ngặt các tiêu chuẩn phát triển nội bộ trong phát triển dự án, tạo nên một hình mẫu về sự xuất sắc và chuyên nghiệp.',
    '02 Tập thể',
    '15.000.000 VNĐ mỗi giải',
    '#FAE287',
    '/saa-2025/medallion-top-project.png',
    2
  ),
  (
    'top-project-leader',
    'Top Project Leader',
    'Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc – những người hội tụ năng lực quản lý vững vàng, khả năng truyền cảm hứng mạnh mẽ, và tư duy "Aim High – Be Agile" trong mọi bài toán và bối cảnh. Dưới sự dẫn dắt của họ, các thành viên không chỉ cùng nhau vượt qua thử thách và đạt được mục tiêu đề ra, mà còn giữ vững ngọn lửa nhiệt huyết, tinh thần Wasshoi, và trưởng thành để trở thành phiên bản tinh hoa – hạnh phúc hơn của chính mình.',
    '03 Cá nhân',
    '7.000.000 VNĐ',
    '#FAE287',
    '/saa-2025/medallion-top-project-leader.png',
    3
  ),
  (
    'best-manager',
    'Best Manager',
    'Giải thưởng Best Manager vinh danh những nhà lãnh đạo tiêu biểu – người đã dẫn dắt đội ngũ của mình tạo ra kết quả vượt kỳ vọng, tác động nổi bật đến hiệu quả kinh doanh và sự phát triển bền vững của tổ chức. Dưới sự lãnh đạo của họ, đội ngũ luôn chinh phục và làm chủ mọi mục tiêu bằng năng lực đa nhiệm, khả năng phối hợp hiệu quả, và tư duy ứng dụng công nghệ linh hoạt trong kỷ nguyên số. Họ truyền cảm hứng để tập thể trở nên tự tin tràn đầy năng lượng, sẵn sàng đón nhận, thậm chí dẫn dắt tạo ra những thay đổi có tính cách mạng.',
    '01 Cá nhân',
    '10.000.000 VNĐ',
    '#FAE287',
    '/saa-2025/medallion-best-manager.png',
    4
  ),
  (
    'signature-creator',
    'Signature 2025 - Creator',
    'Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ. Trong năm 2025, giải thưởng Signature vinh danh Creator - cá nhân/tập thể mang tư duy chủ động và nhạy bén, luôn nhìn thấy cơ hội trong thách thức và tiên phong trong hành động. Họ là những người nhạy bén với vấn đề, nhanh chóng nhận diện và đưa ra những giải pháp thực tiễn, mang lại giá trị rõ rệt cho dự án, khách hàng hoặc tổ chức. Với tư duy kiến tạo và tinh thần "Creator" đặc trưng của Sun*, họ không chỉ phản ứng tích cực trước sự thay đổi mà còn chủ động tạo ra cải tiến, góp phần định hình chuẩn mực mới cho cách mà người Sun* tạo giá trị.',
    '01',
    '5.000.000 VNĐ (cá nhân) / 8.000.000 VNĐ (tập thể)',
    '#FAE287',
    '/saa-2025/medallion-signature.png',
    5
  ),
  (
    'mvp',
    'MVP (Most Valuable Person)',
    'Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm – gương mặt tiêu biểu đại diện cho toàn bộ tập thể Sun*. Họ là người đã thể hiện năng lực vượt trội, tinh thần cống hiến bền bỉ, và tầm ảnh hưởng sâu rộng, để lại dấu ấn mạnh mẽ trong hành trình của Sun* suốt năm qua. Không chỉ nổi bật bởi hiệu suất và kết quả công việc, họ còn là nguồn cảm hứng lan tỏa – thông qua suy nghĩ, hành động và ảnh hưởng tích cực của mình đối với tập thể. MVP là người hội tụ đầy đủ phẩm chất của người Sun* ưu tú, đồng thời mang trên mình trọng trách lớn lao: trở thành hình mẫu đại diện cho con người và tinh thần Sun*, góp phần dẫn dắt tập thể vươn tới những đỉnh cao mới.',
    '01',
    '15.000.000 VNĐ',
    '#FAE287',
    '/saa-2025/medallion-mvp.png',
    6
  );

-- --- badges (6) weight sum = 1.00 --------------------------------------------
delete from public.badges where id in (
  'stay-gold','flow-to-horizon','touch-of-light','beyond-the-boundary','revival','root-further'
);

insert into public.badges (id, name, image, weight) values
  ('stay-gold',          'Stay Gold',           '/saa-2025/badge-stay-gold.png',           0.30),
  ('flow-to-horizon',    'Flow to Horizon',      '/saa-2025/badge-flow-to-horizon.png',     0.25),
  ('touch-of-light',     'Touch of Light',       '/saa-2025/badge-touch-of-light.png',      0.20),
  ('beyond-the-boundary','Beyond the Boundary',  '/saa-2025/badge-beyond-the-boundary.png', 0.10),
  ('revival',            'Revival',              '/saa-2025/badge-revival.png',             0.10),
  ('root-further',       'Root Further',         '/saa-2025/badge-root-further.png',        0.05);

-- =============================================================================
-- SECTION 2: Test account (original block — KEEP as-is)
-- =============================================================================

-- Idempotent: clear any prior test account so re-seeding is safe.
delete from auth.identities where user_id = '11111111-1111-1111-1111-111111111111';
delete from auth.users where id = '11111111-1111-1111-1111-111111111111';

-- The auth user. Password is bcrypt-hashed via pgcrypto's crypt(); email is pre-confirmed
-- so the account can sign in immediately without an email round-trip.
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) values (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- The matching email identity (GoTrue requires an identities row for the provider).
insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '{"sub":"11111111-1111-1111-1111-111111111111","email":"test@example.com"}',
  'email',
  now(),
  now(),
  now()
);

-- =============================================================================
-- SECTION 3: Demo users
-- Fixed UUIDs: 22222222-…-2222 through 66666666-…-6666.
-- Trigger handle_new_user auto-creates profiles + secret_boxes rows on INSERT.
-- =============================================================================

-- Idempotent: remove demo users/identities in reverse-dependency order.
delete from auth.identities where user_id in (
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666'
);
delete from auth.users where id in (
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666'
);

-- Nguyễn Minh Tuấn (CEVC10)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values (
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated', 'authenticated',
  'nguyen.minh.tuan@demo.local',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
);
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values (
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '{"sub":"22222222-2222-2222-2222-222222222222","email":"nguyen.minh.tuan@demo.local"}',
  'email', now(), now(), now()
);

-- Trần Thị Lan Anh (DXD01)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values (
  '00000000-0000-0000-0000-000000000000',
  '33333333-3333-3333-3333-333333333333',
  'authenticated', 'authenticated',
  'tran.thi.lan.anh@demo.local',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
);
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values (
  '33333333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-333333333333',
  '{"sub":"33333333-3333-3333-3333-333333333333","email":"tran.thi.lan.anh@demo.local"}',
  'email', now(), now(), now()
);

-- Lê Văn Hùng (PMG02)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values (
  '00000000-0000-0000-0000-000000000000',
  '44444444-4444-4444-4444-444444444444',
  'authenticated', 'authenticated',
  'le.van.hung@demo.local',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
);
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values (
  '44444444-4444-4444-4444-444444444444',
  '44444444-4444-4444-4444-444444444444',
  '{"sub":"44444444-4444-4444-4444-444444444444","email":"le.van.hung@demo.local"}',
  'email', now(), now(), now()
);

-- Phạm Thu Hương (HRD01)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values (
  '00000000-0000-0000-0000-000000000000',
  '55555555-5555-5555-5555-555555555555',
  'authenticated', 'authenticated',
  'pham.thu.huong@demo.local',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
);
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values (
  '55555555-5555-5555-5555-555555555555',
  '55555555-5555-5555-5555-555555555555',
  '{"sub":"55555555-5555-5555-5555-555555555555","email":"pham.thu.huong@demo.local"}',
  'email', now(), now(), now()
);

-- Vũ Quốc Bảo (CEVC10)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values (
  '00000000-0000-0000-0000-000000000000',
  '66666666-6666-6666-6666-666666666666',
  'authenticated', 'authenticated',
  'vu.quoc.bao@demo.local',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
);
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values (
  '66666666-6666-6666-6666-666666666666',
  '66666666-6666-6666-6666-666666666666',
  '{"sub":"66666666-6666-6666-6666-666666666666","email":"vu.quoc.bao@demo.local"}',
  'email', now(), now(), now()
);

-- =============================================================================
-- SECTION 4: Update profile details
-- Trigger created rows; we only need to fill in the display fields.
-- =============================================================================

-- Test user (Huỳnh Dương Xuân Nhật, CECV10)
update public.profiles
set
  full_name      = 'Huỳnh Dương Xuân Nhật',
  dept_code      = 'CECV10',
  avatar_initial = 'H'
where id = '11111111-1111-1111-1111-111111111111';

-- Nguyễn Minh Tuấn
update public.profiles
set
  full_name      = 'Nguyễn Minh Tuấn',
  dept_code      = 'CEVC10',
  avatar_initial = 'N'
where id = '22222222-2222-2222-2222-222222222222';

-- Trần Thị Lan Anh
update public.profiles
set
  full_name      = 'Trần Thị Lan Anh',
  dept_code      = 'DXD01',
  avatar_initial = 'T'
where id = '33333333-3333-3333-3333-333333333333';

-- Lê Văn Hùng
update public.profiles
set
  full_name      = 'Lê Văn Hùng',
  dept_code      = 'PMG02',
  avatar_initial = 'L'
where id = '44444444-4444-4444-4444-444444444444';

-- Phạm Thu Hương
update public.profiles
set
  full_name      = 'Phạm Thu Hương',
  dept_code      = 'HRD01',
  avatar_initial = 'P'
where id = '55555555-5555-5555-5555-555555555555';

-- Vũ Quốc Bảo
update public.profiles
set
  full_name      = 'Vũ Quốc Bảo',
  dept_code      = 'CEVC10',
  avatar_initial = 'V'
where id = '66666666-6666-6666-6666-666666666666';

-- =============================================================================
-- SECTION 5: Demo kudos
-- Test user (11111111) is the RECEIVER of 12 kudos → Super Hero tier (10-20).
-- Test user is SENDER of 3 kudos.
-- on_kudos_insert trigger auto-increments receivers' secret_boxes.
-- Fixed UUIDs for idempotency.
-- =============================================================================

-- Remove demo kudos (cascade removes kudos_hashtags, kudos_images, hearts).
delete from public.kudos where id in (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'aaaaaaaa-0002-0000-0000-000000000000',
  'aaaaaaaa-0003-0000-0000-000000000000',
  'aaaaaaaa-0004-0000-0000-000000000000',
  'aaaaaaaa-0005-0000-0000-000000000000',
  'aaaaaaaa-0006-0000-0000-000000000000',
  'aaaaaaaa-0007-0000-0000-000000000000',
  'aaaaaaaa-0008-0000-0000-000000000000',
  'aaaaaaaa-0009-0000-0000-000000000000',
  'aaaaaaaa-0010-0000-0000-000000000000',
  'aaaaaaaa-0011-0000-0000-000000000000',
  'aaaaaaaa-0012-0000-0000-000000000000',
  'aaaaaaaa-0013-0000-0000-000000000000',
  'aaaaaaaa-0014-0000-0000-000000000000',
  'aaaaaaaa-0015-0000-0000-000000000000'
);

-- Kudos received by test user (12 rows → Super Hero tier)
insert into public.kudos (id, sender_id, receiver_id, danh_hieu, message, is_anonymous, created_at)
values
  -- k01: Nguyễn Minh Tuấn → test user
  ('aaaaaaaa-0001-0000-0000-000000000000',
   '22222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111',
   'Người đồng hành tuyệt vời',
   'Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất lớn cho team trong suốt sprint này.',
   false,
   now() - interval '14 days'),

  -- k02: Trần Thị Lan Anh → test user
  ('aaaaaaaa-0002-0000-0000-000000000000',
   '33333333-3333-3333-3333-333333333333',
   '11111111-1111-1111-1111-111111111111',
   'Dedicated Teammate',
   'Bạn Nhật luôn sẵn sàng giúp đỡ và hỗ trợ team khi cần. Rất trân trọng sự cống hiến của bạn!',
   false,
   now() - interval '13 days'),

  -- k03: Lê Văn Hùng → test user
  ('aaaaaaaa-0003-0000-0000-000000000000',
   '44444444-4444-4444-4444-444444444444',
   '11111111-1111-1111-1111-111111111111',
   'Innovation Driver',
   'Nhật đã đóng góp rất nhiều ý tưởng sáng tạo cho dự án. Team rất may mắn khi có bạn!',
   false,
   now() - interval '12 days'),

  -- k04: Phạm Thu Hương → test user
  ('aaaaaaaa-0004-0000-0000-000000000000',
   '55555555-5555-5555-5555-555555555555',
   '11111111-1111-1111-1111-111111111111',
   'Rising Star',
   'Xuân Nhật luôn hoàn thành công việc với chất lượng cao và đúng deadline. Tuyệt vời!',
   false,
   now() - interval '11 days'),

  -- k05: Vũ Quốc Bảo → test user
  ('aaaaaaaa-0005-0000-0000-000000000000',
   '66666666-6666-6666-6666-666666666666',
   '11111111-1111-1111-1111-111111111111',
   'Tech Champion',
   'Bạn giải quyết bug production trong đêm mà không than vãn. Cảm ơn sự tận tâm của bạn!',
   false,
   now() - interval '10 days'),

  -- k06: Nguyễn Minh Tuấn → test user (second)
  ('aaaaaaaa-0006-0000-0000-000000000000',
   '22222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111',
   'Team Player',
   'Sprint review vừa rồi client rất hài lòng, một phần lớn nhờ sự đóng góp của Nhật. Bravo!',
   false,
   now() - interval '9 days'),

  -- k07: Trần Thị Lan Anh → test user (second)
  ('aaaaaaaa-0007-0000-0000-000000000000',
   '33333333-3333-3333-3333-333333333333',
   '11111111-1111-1111-1111-111111111111',
   'Supportive Friend',
   'Nhật luôn lắng nghe và đưa ra lời khuyên rất thiết thực. Cảm ơn bạn rất nhiều!',
   false,
   now() - interval '8 days'),

  -- k08: Lê Văn Hùng → test user (second)
  ('aaaaaaaa-0008-0000-0000-000000000000',
   '44444444-4444-4444-4444-444444444444',
   '11111111-1111-1111-1111-111111111111',
   'Code Quality Master',
   'PR của Nhật lần nào cũng clean, có test đầy đủ. Là gương mẫu cho cả team!',
   false,
   now() - interval '7 days'),

  -- k09: Phạm Thu Hương → test user (second) — anonymous
  ('aaaaaaaa-0009-0000-0000-000000000000',
   '55555555-5555-5555-5555-555555555555',
   '11111111-1111-1111-1111-111111111111',
   null,
   'Một người đồng nghiệp tuyệt vời, luôn mang lại năng lượng tích cực cho văn phòng mỗi ngày.',
   true,
   now() - interval '6 days'),

  -- k10: Vũ Quốc Bảo → test user (second)
  ('aaaaaaaa-0010-0000-0000-000000000000',
   '66666666-6666-6666-6666-666666666666',
   '11111111-1111-1111-1111-111111111111',
   'Mentor',
   'Nhật đã giúp mình hiểu rõ hơn về kiến trúc hệ thống. Cảm ơn sự kiên nhẫn và tận tình của bạn!',
   false,
   now() - interval '5 days'),

  -- k11: Nguyễn Minh Tuấn → test user (third)
  ('aaaaaaaa-0011-0000-0000-000000000000',
   '22222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111',
   'Communication Pro',
   'Cách Nhật trình bày trong buổi demo với stakeholder rất ấn tượng. Học được nhiều từ bạn!',
   false,
   now() - interval '4 days'),

  -- k12: Trần Thị Lan Anh → test user (third — 12th received = Super Hero)
  ('aaaaaaaa-0012-0000-0000-000000000000',
   '33333333-3333-3333-3333-333333333333',
   '11111111-1111-1111-1111-111111111111',
   'Leadership Potential',
   'Nhật thể hiện tinh thần lãnh đạo rất tốt trong dự án vừa rồi. Rất kỳ vọng vào bạn!',
   false,
   now() - interval '3 days'),

  -- Kudos SENT by test user (3 rows)
  -- k13: test user → Nguyễn Minh Tuấn
  ('aaaaaaaa-0013-0000-0000-000000000000',
   '11111111-1111-1111-1111-111111111111',
   '22222222-2222-2222-2222-222222222222',
   'Tech Guru',
   'Anh Tuấn giải quyết vấn đề kỹ thuật cực kỳ nhanh và hiệu quả. Học được rất nhiều từ anh trong sprint vừa rồi!',
   false,
   now() - interval '2 days'),

  -- k14: test user → Phạm Thu Hương
  ('aaaaaaaa-0014-0000-0000-000000000000',
   '11111111-1111-1111-1111-111111111111',
   '55555555-5555-5555-5555-555555555555',
   'Inspiring Leader',
   'Chị Hương luôn là người truyền cảm hứng cho cả team. Cảm ơn chị vì những lời động viên đúng lúc!',
   false,
   now() - interval '1 day'),

  -- k15: test user → Lê Văn Hùng
  ('aaaaaaaa-0015-0000-0000-000000000000',
   '11111111-1111-1111-1111-111111111111',
   '44444444-4444-4444-4444-444444444444',
   'Dedicated Pro',
   'Anh Hùng đã hỗ trợ team rất nhiều trong dự án lần này. Sự tận tâm và chuyên nghiệp của anh thật đáng noi gương.',
   false,
   now() - interval '12 hours');

-- =============================================================================
-- SECTION 6: kudos_hashtags (junction)
-- =============================================================================

insert into public.kudos_hashtags (kudos_id, hashtag_id) values
  -- k01: #Dedicated(1), #Inspiring(2)
  ('aaaaaaaa-0001-0000-0000-000000000000', 1),
  ('aaaaaaaa-0001-0000-0000-000000000000', 2),
  -- k02: #Dedicated(1), #Supportive(9)
  ('aaaaaaaa-0002-0000-0000-000000000000', 1),
  ('aaaaaaaa-0002-0000-0000-000000000000', 9),
  -- k03: #Innovation(8)
  ('aaaaaaaa-0003-0000-0000-000000000000', 8),
  -- k04: #Dedicated(1), #Technical(5)
  ('aaaaaaaa-0004-0000-0000-000000000000', 1),
  ('aaaaaaaa-0004-0000-0000-000000000000', 5),
  -- k05: #Technical(5)
  ('aaaaaaaa-0005-0000-0000-000000000000', 5),
  -- k06: #Teamwork(3), #Inspiring(2)
  ('aaaaaaaa-0006-0000-0000-000000000000', 3),
  ('aaaaaaaa-0006-0000-0000-000000000000', 2),
  -- k07: #Supportive(9)
  ('aaaaaaaa-0007-0000-0000-000000000000', 9),
  -- k08: #Technical(5), #Dedicated(1)
  ('aaaaaaaa-0008-0000-0000-000000000000', 5),
  ('aaaaaaaa-0008-0000-0000-000000000000', 1),
  -- k09: (anonymous — no hashtags)
  -- k10: #Mentoring(7)
  ('aaaaaaaa-0010-0000-0000-000000000000', 7),
  -- k11: #Communication(6)
  ('aaaaaaaa-0011-0000-0000-000000000000', 6),
  -- k12: #Leadership(4), #Inspiring(2)
  ('aaaaaaaa-0012-0000-0000-000000000000', 4),
  ('aaaaaaaa-0012-0000-0000-000000000000', 2),
  -- k13 (sent by test): #Technical(5), #Mentoring(7)
  ('aaaaaaaa-0013-0000-0000-000000000000', 5),
  ('aaaaaaaa-0013-0000-0000-000000000000', 7),
  -- k14 (sent by test): #Inspiring(2), #Leadership(4)
  ('aaaaaaaa-0014-0000-0000-000000000000', 2),
  ('aaaaaaaa-0014-0000-0000-000000000000', 4),
  -- k15 (sent by test): #Dedicated(1), #Teamwork(3)
  ('aaaaaaaa-0015-0000-0000-000000000000', 1),
  ('aaaaaaaa-0015-0000-0000-000000000000', 3);

-- =============================================================================
-- SECTION 7: Hearts (likes)
-- Spread across kudos; test user likes a couple.
-- =============================================================================

insert into public.hearts (kudos_id, user_id) values
  -- Others like k01 (test user received)
  ('aaaaaaaa-0001-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-0001-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555'),
  ('aaaaaaaa-0001-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666'),
  -- Others like k02
  ('aaaaaaaa-0002-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-0002-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666'),
  -- Others like k03
  ('aaaaaaaa-0003-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-0003-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555'),
  -- Test user likes k13 (kudo they sent — can't; they're the sender not the receiver)
  -- Test user likes kudos sent to others
  ('aaaaaaaa-0002-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-0003-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'),
  -- Others like kudos received by test user
  ('aaaaaaaa-0006-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333'),
  ('aaaaaaaa-0006-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-0008-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-0012-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666');
