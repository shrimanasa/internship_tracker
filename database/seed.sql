-- seed.sql: Seeds mock data for Indian college/student scenarios in InternTrack.
-- All student passwords are seeded with the hash for 'Student@123'
-- Hashed password for student: $2b$12$Hk5P1RzE6CjB2YyT9vLqU.6uR6sQp9Z2n8wK7zH6dG5p5M5V5V5V5 (Student@123)
-- Hashed password for admin: $2b$12$qR1.JpXlQJqf6vjQxXzHmeK085.6bC.rB8LqZ8.45GzQ58.2QJp3e (Admin@123)

-- 1. Departments
INSERT INTO departments (department_name, department_code) VALUES
('Computer Science and Engineering', 'CSE'),
('Computer Science - Artificial Intelligence', 'CSE-AI'),
('Electronics and Communication Engineering', 'ECE'),
('Electrical and Electronics Engineering', 'EEE'),
('Mechanical Engineering', 'Mechanical'),
('Civil Engineering', 'Civil');

-- 2. Users (1 Admin, 10 Students)
INSERT INTO users (full_name, email, password_hash, role, is_active) VALUES
('System Administrator', 'admin@interntrack.com', '$2b$12$qR1.JpXlQJqf6vjQxXzHmeK085.6bC.rB8LqZ8.45GzQ58.2QJp3e', 'admin', true),
('Aarav Patel', 'aarav.patel@student.edu', '$2b$12$Hk5P1RzE6CjB2YyT9vLqU.6uR6sQp9Z2n8wK7zH6dG5p5M5V5V5V5', 'student', true),
('Ananya Iyer', 'ananya.iyer@student.edu', '$2b$12$Hk5P1RzE6CjB2YyT9vLqU.6uR6sQp9Z2n8wK7zH6dG5p5M5V5V5V5', 'student', true),
('Vihaan Sharma', 'vihaan.sharma@student.edu', '$2b$12$Hk5P1RzE6CjB2YyT9vLqU.6uR6sQp9Z2n8wK7zH6dG5p5M5V5V5V5', 'student', true),
('Diya Nair', 'diya.nair@student.edu', '$2b$12$Hk5P1RzE6CjB2YyT9vLqU.6uR6sQp9Z2n8wK7zH6dG5p5M5V5V5V5', 'student', true),
('Aditya Verma', 'aditya.verma@student.edu', '$2b$12$Hk5P1RzE6CjB2YyT9vLqU.6uR6sQp9Z2n8wK7zH6dG5p5M5V5V5V5', 'student', true),
('Neha Gupta', 'neha.gupta@student.edu', '$2b$12$Hk5P1RzE6CjB2YyT9vLqU.6uR6sQp9Z2n8wK7zH6dG5p5M5V5V5V5', 'student', true),
('Rohan Mehta', 'rohan.mehta@student.edu', '$2b$12$Hk5P1RzE6CjB2YyT9vLqU.6uR6sQp9Z2n8wK7zH6dG5p5M5V5V5V5', 'student', true),
('Shruti Joshi', 'shruti.joshi@student.edu', '$2b$12$Hk5P1RzE6CjB2YyT9vLqU.6uR6sQp9Z2n8wK7zH6dG5p5M5V5V5V5', 'student', true),
('Vikram Rao', 'vikram.rao@student.edu', '$2b$12$Hk5P1RzE6CjB2YyT9vLqU.6uR6sQp9Z2n8wK7zH6dG5p5M5V5V5V5', 'student', true),
('Sai Prasad', 'sai.prasad@student.edu', '$2b$12$Hk5P1RzE6CjB2YyT9vLqU.6uR6sQp9Z2n8wK7zH6dG5p5M5V5V5V5', 'student', true);

-- 3. Student Profiles
INSERT INTO student_profiles (user_id, register_number, department_id, phone_number, graduation_year, current_semester, cgpa, location, preferred_work_mode, preferred_roles, bio, linkedin_url, github_url, portfolio_url) VALUES
(2, 'SRN2023CSE01', 1, '9876543210', 2027, 6, 8.75, 'Bengaluru', 'Hybrid', 'Full Stack Developer, Backend Developer', 'Passionate about React, Node.js, and DB systems.', 'https://linkedin.com/in/aarav-patel', 'https://github.com/aaravpatel', 'https://aarav.dev'),
(3, 'SRN2023CSE02', 1, '9876543211', 2027, 6, 9.20, 'Chennai', 'Remote', 'Frontend Developer, UI Engineer', 'UI/UX enthusiast. Love coding in Next.js and Tailwind.', 'https://linkedin.com/in/ananya-iyer', 'https://github.com/ananyaiyer', 'https://ananya.design'),
(4, 'SRN2023AI01', 2, '9876543212', 2027, 6, 7.80, 'Hyderabad', 'On-site', 'AI/ML Engineer, Data Analyst', 'Building NLP agents and computer vision pipelines.', 'https://linkedin.com/in/vihaan-sharma', 'https://github.com/vihaansharma', ''),
(5, 'SRN2023AI02', 2, '9876543213', 2027, 6, 9.50, 'Bengaluru', 'Remote', 'Data Scientist, Research Assistant', 'Interested in Generative AI and deep reinforcement learning.', 'https://linkedin.com/in/diya-nair', 'https://github.com/diyanair', 'https://diya.ai'),
(6, 'SRN2023ECE01', 3, '9876543214', 2027, 6, 8.10, 'Pune', 'On-site', 'Embedded Systems Engineer, IoT Developer', 'ECE student working on Arduino, ESP32 and RTOS.', 'https://linkedin.com/in/aditya-verma', 'https://github.com/adityaverma', ''),
(7, 'SRN2023ECE02', 3, '9876543215', 2027, 6, 8.90, 'Noida', 'Hybrid', 'VLSI Intern, Hardware Analyst', 'Fascinated by Verilog, computer architecture, and digital circuits.', 'https://linkedin.com/in/neha-gupta', 'https://github.com/nehagupta', ''),
(8, 'SRN2023EEE01', 4, '9876543216', 2027, 6, 7.20, 'Mumbai', 'On-site', 'Power Systems Intern, Smart Grid Dev', 'Electrical student focused on EV modeling and solar grid optimization.', 'https://linkedin.com/in/rohan-mehta', 'https://github.com/rohanmehta', ''),
(9, 'SRN2023EEE02', 4, '9876543217', 2027, 6, 8.40, 'Ahmedabad', 'Hybrid', 'Automation Intern, Controls Engineer', 'Passionate about PLC programming and control systems.', 'https://linkedin.com/in/shruti-joshi', 'https://github.com/shrutijoshi', ''),
(10, 'SRN2023ME01', 5, '9876543218', 2027, 6, 7.50, 'Coimbatore', 'On-site', 'CAD Designer, HVAC Intern', 'Familiar with SolidWorks, AutoCAD, and FEA simulation.', 'https://linkedin.com/in/vikram-rao', 'https://github.com/vikramrao', ''),
(11, 'SRN2023CE01', 6, '9876543219', 2027, 6, 8.30, 'Kochi', 'On-site', 'Structural Consultant, Site Intern', 'Interested in structural analysis and sustainable construction materials.', 'https://linkedin.com/in/sai-prasad', 'https://github.com/saiprasad', '');

-- 4. Education (1 per student)
INSERT INTO education (student_id, institution_name, qualification, specialization, start_year, end_year, score, score_type) VALUES
(1, 'PES University', 'B.Tech', 'Computer Science and Engineering', 2023, 2027, 8.75, 'CGPA'),
(2, 'IIT Madras', 'B.Tech', 'Computer Science and Engineering', 2023, 2027, 9.20, 'CGPA'),
(3, 'BITS Pilani', 'B.Tech', 'Artificial Intelligence', 2023, 2027, 7.80, 'CGPA'),
(4, 'RV College of Engineering', 'B.Tech', 'Artificial Intelligence & Machine Learning', 2023, 2027, 9.50, 'CGPA'),
(5, 'COEP Tech University', 'B.Tech', 'Electronics & Telecommunication', 2023, 2027, 8.10, 'CGPA'),
(6, 'Delhi Technological University', 'B.Tech', 'Electronics and Communication', 2023, 2027, 8.90, 'CGPA'),
(7, 'VJTI Mumbai', 'B.Tech', 'Electrical Engineering', 2023, 2027, 7.20, 'CGPA'),
(8, 'Nirma University', 'B.Tech', 'Electrical Engineering', 2023, 2027, 8.40, 'CGPA'),
(9, 'PSG Tech', 'B.Tech', 'Mechanical Engineering', 2023, 2027, 7.50, 'CGPA'),
(10, 'NIT Calicut', 'B.Tech', 'Civil Engineering', 2023, 2027, 8.30, 'CGPA');

-- 5. Skills (30 Skills)
INSERT INTO skills (skill_name, category, description) VALUES
('Python', 'Programming', 'General-purpose high-level programming language'),
('JavaScript', 'Programming', 'Scripting language for web development'),
('TypeScript', 'Programming', 'Strict syntactical superset of JavaScript adding static typing'),
('Java', 'Programming', 'Class-based, object-oriented programming language'),
('C++', 'Programming', 'High-performance system programming language'),
('HTML5', 'Web Development', 'Markup standard for modern web pages'),
('CSS3', 'Web Development', 'Style sheet language for document styling'),
('React.js', 'Web Development', 'Frontend UI component library'),
('Next.js', 'Web Development', 'Full-stack React framework with SSR and routing'),
('FastAPI', 'Web Development', 'Modern, fast (high-performance) web framework for APIs'),
('Node.js', 'Web Development', 'JavaScript runtime environment built on Chrome V8 engine'),
('SQL', 'Database', 'Standard language for relational databases'),
('PostgreSQL', 'Database', 'Advanced, object-relational database management system'),
('MongoDB', 'Database', 'Document-based NoSQL database'),
('Machine Learning', 'AI/ML', 'Statistical algorithms that learn from data'),
('Deep Learning', 'AI/ML', 'Neural network models for advanced representation learning'),
('Natural Language Processing', 'AI/ML', 'Computational processing of human language'),
('Docker', 'DevOps', 'Platform for developing, shipping, and running applications in containers'),
('Kubernetes', 'DevOps', 'Open-source container orchestration platform'),
('AWS', 'Cloud', 'Amazon Web Services cloud platform'),
('Git', 'DevOps', 'Distributed version control system'),
('Verilog', 'Other', 'Hardware Description Language for digital design'),
('SolidWorks', 'Other', '3D CAD design and engineering modeling software'),
('AutoCAD', 'Other', 'Computer-aided design drafting software'),
('Communication', 'Soft Skill', 'Effective verbal and written skills in professional settings'),
('Problem Solving', 'Soft Skill', 'Analytical and critical thinking to resolve complex tasks'),
('Teamwork', 'Soft Skill', 'Collaborative skills in multi-disciplinary teams'),
('Time Management', 'Soft Skill', 'Organizing and planning task allocations effectively'),
('Arduino', 'Other', 'Open-source hardware/software prototyping platform'),
('PLC Programming', 'Other', 'Industrial automation controller logic');

-- 6. Student Skills
INSERT INTO student_skills (student_id, skill_id, proficiency_level, years_of_experience, verified) VALUES
-- Student 1 (Aarav): React, Next, SQL, Postgre, Git, Communication, Problem Solving
(1, 2, 'Advanced', 2.0, true),
(1, 3, 'Intermediate', 1.5, true),
(1, 8, 'Advanced', 2.0, true),
(1, 9, 'Intermediate', 1.0, false),
(1, 12, 'Advanced', 2.5, true),
(1, 13, 'Intermediate', 1.5, true),
(1, 21, 'Advanced', 3.0, true),
(1, 25, 'Advanced', 4.0, false),
(1, 26, 'Advanced', 4.0, false),
-- Student 2 (Ananya): HTML, CSS, React, Next, JS, TS, Communication
(2, 2, 'Advanced', 2.5, true),
(2, 3, 'Advanced', 2.0, true),
(2, 6, 'Advanced', 3.0, true),
(2, 7, 'Advanced', 3.0, true),
(2, 8, 'Advanced', 2.5, true),
(2, 9, 'Advanced', 2.0, true),
(2, 25, 'Advanced', 5.0, false),
-- Student 3 (Vihaan): Python, SQL, ML, NLP, Git, Problem Solving
(3, 1, 'Advanced', 2.0, true),
(3, 12, 'Intermediate', 1.5, true),
(3, 15, 'Advanced', 1.5, true),
(3, 17, 'Intermediate', 1.0, false),
(3, 21, 'Intermediate', 2.0, false),
(3, 26, 'Intermediate', 3.0, false),
-- Student 4 (Diya): Python, ML, Deep Learning, SQL, Postgre, Docker, Problem Solving
(4, 1, 'Advanced', 3.0, true),
(4, 12, 'Advanced', 2.0, true),
(4, 13, 'Advanced', 2.0, true),
(4, 15, 'Advanced', 2.5, true),
(4, 16, 'Advanced', 2.0, true),
(4, 18, 'Intermediate', 1.0, false),
(4, 26, 'Advanced', 5.0, false),
-- Student 5 (Aditya): C++, Git, Arduino, Problem Solving
(5, 5, 'Advanced', 2.0, true),
(5, 21, 'Advanced', 2.5, true),
(5, 29, 'Advanced', 2.0, true),
(5, 26, 'Intermediate', 3.0, false),
-- Student 6 (Neha): Verilog, C++, Problem Solving, Teamwork
(6, 5, 'Intermediate', 1.5, true),
(6, 22, 'Advanced', 2.0, true),
(6, 26, 'Advanced', 4.0, false),
(6, 27, 'Advanced', 5.0, false),
-- Student 7 (Rohan): Python, SolidWorks, Teamwork
(7, 1, 'Intermediate', 1.0, false),
(7, 23, 'Intermediate', 1.5, true),
(7, 27, 'Advanced', 3.0, false),
-- Student 8 (Shruti): PLC Programming, Communication
(8, 30, 'Advanced', 2.0, true),
(8, 25, 'Advanced', 4.0, false),
-- Student 9 (Vikram): AutoCAD, SolidWorks, Problem Solving
(9, 23, 'Advanced', 2.0, true),
(9, 24, 'Advanced', 2.5, true),
(9, 26, 'Intermediate', 2.0, false),
-- Student 10 (Sai): AutoCAD, Teamwork
(10, 24, 'Advanced', 2.0, true),
(10, 27, 'Advanced', 4.0, false);

-- 7. Companies (12 Companies)
INSERT INTO companies (company_name, industry, company_size, website_url, linkedin_url, headquarters, description, logo_url) VALUES
('Google India', 'Technology', '10000+', 'https://google.co.in', 'https://linkedin.com/company/google', 'Bengaluru', 'Global search engine and cloud company.', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=64&h=64&fit=crop'),
('Zoho Corporation', 'Software / SaaS', '5000-10000', 'https://zoho.com', 'https://linkedin.com/company/zoho', 'Chennai', 'Cloud business software suite provider.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&h=64&fit=crop'),
('Razorpay', 'Fintech', '1000-5000', 'https://razorpay.com', 'https://linkedin.com/company/razorpay', 'Bengaluru', 'India''s leading online payments platform.', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=64&h=64&fit=crop'),
('Tata Consultancy Services', 'IT Services', '10000+', 'https://tcs.com', 'https://linkedin.com/company/tcs', 'Mumbai', 'Leading global IT consultancy.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=64&h=64&fit=crop'),
('Infosys Limited', 'IT Services', '10000+', 'https://infosys.com', 'https://linkedin.com/company/infosys', 'Bengaluru', 'Global consulting and digital services company.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=64&h=64&fit=crop'),
('Freshworks', 'Software / SaaS', '1000-5000', 'https://freshworks.com', 'https://linkedin.com/company/freshworks', 'Chennai', 'Customer engagement software solutions.', 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=64&h=64&fit=crop'),
('Cred', 'Fintech', '500-1000', 'https://cred.club', 'https://linkedin.com/company/cred', 'Bengaluru', 'Exclusive club for creditworthy individuals.', 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=64&h=64&fit=crop'),
('Flipkart', 'E-commerce', '10000+', 'https://flipkart.com', 'https://linkedin.com/company/flipkart', 'Bengaluru', 'India''s premier e-commerce marketplace.', 'https://images.unsplash.com/photo-1472851294608-062f824d296e?w=64&h=64&fit=crop'),
('Swiggy', 'On-demand Delivery', '5000-10000', 'https://swiggy.com', 'https://linkedin.com/company/swiggy', 'Bengaluru', 'Food and grocery delivery provider.', 'https://images.unsplash.com/photo-1526367790999-015078648c7e?w=64&h=64&fit=crop'),
('Reliance Industries', 'Conglomerate', '10000+', 'https://ril.com', 'https://linkedin.com/company/reliance', 'Mumbai', 'Energy, retail, and digital services giant.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=64&h=64&fit=crop'),
('Intel India', 'Semiconductors', '10000+', 'https://intel.in', 'https://linkedin.com/company/intel', 'Bengaluru', 'Global semiconductor chip design leader.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=64&h=64&fit=crop'),
('L&T Construction', 'Infrastructure', '10000+', 'https://lntecc.com', 'https://linkedin.com/company/l&t', 'Chennai', 'India''s largest engineering and construction firm.', 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=64&h=64&fit=crop');

-- 8. Internships (25 Postings)
INSERT INTO internships (company_id, title, description, location, work_mode, internship_type, duration, stipend_min, stipend_max, currency, eligibility_cgpa, application_deadline, number_of_openings, source, status, created_by) VALUES
(1, 'Software Engineering Intern', 'Work with the Google Search or Cloud team on production web systems. Experience with Java, Python or C++.', 'Bengaluru', 'Hybrid', 'Paid', 6, 80000.00, 100000.00, 'INR', 8.50, '2026-09-30 23:59:59+05:30', 5, 'Internal', 'Open', 1),
(2, 'Backend Developer Intern', 'Implement REST API servers using Python, FastAPI or Node.js. Interact with PostgreSQL and Redis caches.', 'Chennai', 'Remote', 'Paid', 6, 25000.00, 35000.00, 'INR', 7.50, '2026-08-31 23:59:59+05:30', 10, 'Internal', 'Open', 1),
(3, 'Full Stack Intern (React + Django)', 'Contribute to Razorpay''s merchant dashboard. Full stack features, analytics, and billing views.', 'Bengaluru', 'Hybrid', 'Paid', 6, 45000.00, 50000.00, 'INR', 8.00, '2026-08-15 23:59:59+05:30', 3, 'Internal', 'Open', 1),
(6, 'Frontend Engineering Intern', 'Build high-performance web components using React, TypeScript, and Tailwind CSS. Focus on accessibility and SEO.', 'Chennai', 'Remote', 'Paid', 3, 20000.00, 25000.00, 'INR', 7.00, '2026-08-20 23:59:59+05:30', 6, 'Internal', 'Open', 1),
(11, 'Hardware Design Intern', 'Perform digital design verification using Verilog/VHDL and simulate RTL models for modern microprocessors.', 'Bengaluru', 'On-site', 'Paid', 6, 50000.00, 60000.00, 'INR', 8.00, '2026-09-15 23:59:59+05:30', 4, 'Internal', 'Open', 1),
(4, 'Graduate Engineer Trainee', 'Mass recruitment drive for application support, software testing, and maintenance projects.', 'Pune', 'On-site', 'Paid', 12, 15000.00, 18000.00, 'INR', 6.00, '2026-10-31 23:59:59+05:30', 50, 'Internal', 'Open', 1),
(5, 'React Specialist', 'Deep dive into rendering optimization, Next.js server components, and responsive grid layouts.', 'Bengaluru', 'Remote', 'Paid', 3, 20000.00, 22000.00, 'INR', 7.50, '2026-07-28 23:59:59+05:30', 2, 'Internal', 'Open', 1),
(7, 'Security Engineering Intern', 'Penetration testing, identity security systems (JWT, OAuth) and auth system auditing.', 'Bengaluru', 'Hybrid', 'Paid', 6, 40000.00, 45000.00, 'INR', 8.00, '2026-08-10 23:59:59+05:30', 2, 'Internal', 'Open', 1),
(8, 'Data Platform Engineer', 'Build ETL pipelines and batch processing clusters using Spark, Hadoop, and MongoDB databases.', 'Bengaluru', 'Hybrid', 'Paid', 6, 35000.00, 40000.00, 'INR', 8.20, '2026-08-25 23:59:59+05:30', 3, 'Internal', 'Open', 1),
(9, 'React Native Mobile Intern', 'Develop features for Swiggy''s delivery app. Optimize geolocation updates and offline storage.', 'Bengaluru', 'Hybrid', 'Paid', 6, 35000.00, 45000.00, 'INR', 7.50, '2026-08-18 23:59:59+05:30', 5, 'Internal', 'Open', 1),
(10, 'Cloud Infrastructure Intern', 'Automate environment setups on AWS using Terraform and Docker. Build CI/CD pipelines.', 'Mumbai', 'On-site', 'Paid', 6, 25000.00, 30000.00, 'INR', 7.00, '2026-08-30 23:59:59+05:30', 3, 'Internal', 'Open', 1),
(12, 'Structural Engineering Intern', 'Help design reinforced concrete structures and execute site audits for commercial projects.', 'Chennai', 'On-site', 'Paid', 6, 12000.00, 15000.00, 'INR', 7.50, '2026-08-20 23:59:59+05:30', 2, 'Internal', 'Open', 1),
(1, 'AI Research Intern', 'Develop fine-tuning models for generative transformers. Requires solid Python and Deep Learning expertise.', 'Bengaluru', 'Hybrid', 'Paid', 6, 90000.00, 110000.00, 'INR', 9.00, '2026-09-10 23:59:59+05:30', 2, 'Internal', 'Open', 1),
(2, 'Technical Writer', 'Draft documentation for Zoho CRM APIs and developer guides. Good communication is mandatory.', 'Chennai', 'Remote', 'Paid', 3, 18000.00, 22000.00, 'INR', 6.00, '2026-07-25 23:59:59+05:30', 4, 'Internal', 'Open', 1),
(11, 'IoT & Embedded firmware Intern', 'Program microcontroller architectures using C++ and debug sensor protocols (I2C, SPI).', 'Bengaluru', 'On-site', 'Paid', 6, 35000.00, 40000.00, 'INR', 7.80, '2026-09-01 23:59:59+05:30', 3, 'Internal', 'Open', 1),
(12, 'Project Estimator Intern', 'Generate material schedules and quantity estimations using AutoCAD models and spreadsheets.', 'Chennai', 'On-site', 'Paid', 3, 10000.00, 12000.00, 'INR', 7.00, '2026-08-15 23:59:59+05:30', 5, 'Internal', 'Open', 1),
-- Closed, Draft, or Archived postings
(3, 'Finance Automation Intern', 'Automate financial reconciliations. (Archived/Closed)', 'Bengaluru', 'Remote', 'Paid', 3, 30000.00, 30000.00, 'INR', 8.00, '2026-06-01 23:59:59+05:30', 1, 'Internal', 'Closed', 1),
(5, 'PHP Dev Intern', 'Legacy CRM migration. (Archived)', 'Bengaluru', 'On-site', 'Paid', 6, 12000.00, 15000.00, 'INR', 6.00, '2026-05-15 23:59:59+05:30', 2, 'Internal', 'Archived', 1),
(1, 'System Kernel Intern', 'Drafting kernel specifications (Draft)', 'Bengaluru', 'On-site', 'Paid', 6, 80000.00, 80000.00, 'INR', 9.00, '2026-12-31 23:59:59+05:30', 1, 'Internal', 'Draft', 1),
-- External Placeholder Postings for seeding references
(4, 'Associate Tester (External)', 'Manual testing of CRM modules.', 'Bengaluru', 'On-site', 'Paid', 6, 15000.00, 15000.00, 'INR', 5.00, '2026-09-30 23:59:59+05:30', 1, 'External', 'Open', 1),
(5, 'Web Assistant (External)', 'Edit WordPress themes.', 'Chennai', 'Remote', 'Unpaid', 3, 0.00, 0.00, 'INR', 5.00, '2026-08-30 23:59:59+05:30', 1, 'External', 'Open', 1),
(6, 'SEO Associate (External)', 'Blog keyword optimization.', 'Remote', 'Remote', 'Paid', 3, 10000.00, 10000.00, 'INR', 6.00, '2026-08-30 23:59:59+05:30', 2, 'External', 'Open', 1),
(7, 'QA intern (External)', 'Automation scripts writing.', 'Bengaluru', 'Hybrid', 'Paid', 6, 25000.00, 25000.00, 'INR', 7.00, '2026-09-01 23:59:59+05:30', 1, 'External', 'Open', 1),
(8, 'UI Designer (External)', 'Create Figma mockups.', 'Mumbai', 'Remote', 'Paid', 3, 15000.00, 15000.00, 'INR', 6.00, '2026-08-31 23:59:59+05:30', 1, 'External', 'Open', 1),
(9, 'Data Entry (External)', 'General office management assistance.', 'Ahmedabad', 'On-site', 'Unpaid', 3, 0.00, 0.00, 'INR', 5.00, '2026-08-15 23:59:59+05:30', 2, 'External', 'Open', 1);

-- 9. Internship Required Skills
INSERT INTO internship_required_skills (internship_id, skill_id, importance_level, minimum_proficiency, is_mandatory) VALUES
-- SWE Intern (Google - Id 1): C++ (High, Adv, Mand), Python (Medium, Inter, false), SQL (Low, Beg, false)
(1, 5, 'High', 'Advanced', true),
(1, 1, 'Medium', 'Intermediate', false),
(1, 12, 'Low', 'Beginner', false),
-- Backend Intern (Zoho - Id 2): Python (High, Inter, Mand), SQL (High, Inter, Mand), FastAPI (Medium, Inter, false), PostgreSQL (Medium, Inter, false)
(2, 1, 'High', 'Intermediate', true),
(2, 12, 'High', 'Intermediate', true),
(2, 10, 'Medium', 'Intermediate', false),
(2, 13, 'Medium', 'Intermediate', false),
-- Full Stack (Razorpay - Id 3): React (High, Adv, Mand), SQL (Medium, Inter, false), JavaScript (Medium, Inter, false), Git (Low, Beg, false)
(3, 8, 'High', 'Advanced', true),
(3, 12, 'Medium', 'Intermediate', false),
(3, 2, 'Medium', 'Intermediate', false),
(3, 21, 'Low', 'Beginner', false),
-- Frontend (Freshworks - Id 4): React (High, Adv, Mand), Next.js (Medium, Inter, false), TypeScript (Medium, Inter, Mand)
(4, 8, 'High', 'Advanced', true),
(4, 9, 'Medium', 'Intermediate', false),
(4, 3, 'Medium', 'Intermediate', true),
-- Hardware Intern (Intel - Id 5): Verilog (High, Adv, Mand), C++ (Medium, Inter, false)
(5, 22, 'High', 'Advanced', true),
(5, 5, 'Medium', 'Intermediate', false),
-- Graduate Trainee (TCS - Id 6): Communication (High, Beg, Mand), Teamwork (Medium, Beg, false)
(6, 25, 'High', 'Beginner', true),
(6, 27, 'Medium', 'Beginner', false),
-- React Specialist (Infosys - Id 7): React (High, Adv, Mand), HTML5 (Medium, Inter, false), CSS3 (Medium, Inter, false)
(7, 8, 'High', 'Advanced', true),
(7, 6, 'Medium', 'Intermediate', false),
(7, 7, 'Medium', 'Intermediate', false),
-- Data Platform (Cred - Id 8): Python (High, Inter, Mand), SQL (Medium, Inter, false), MongoDB (Medium, Inter, false)
(8, 1, 'High', 'Intermediate', true),
(8, 12, 'Medium', 'Intermediate', false),
(8, 14, 'Medium', 'Intermediate', false),
-- Swiggy Mobile (Swiggy - Id 9): JavaScript (High, Adv, Mand), Git (Low, Beg, false)
(9, 2, 'High', 'Advanced', true),
(9, 21, 'Low', 'Beginner', false),
-- Cloud Intern (Reliance - Id 10): Docker (High, Inter, Mand), AWS (Medium, Beg, false), Kubernetes (Low, Beg, false)
(10, 18, 'High', 'Intermediate', true),
(10, 20, 'Medium', 'Beginner', false),
(10, 19, 'Low', 'Beginner', false),
-- L&T Structural (L&T - Id 12): AutoCAD (High, Adv, Mand), Teamwork (Medium, Beg, false)
(12, 24, 'High', 'Advanced', true),
(12, 27, 'Medium', 'Beginner', false),
-- AI Research (Google - Id 13): Python (High, Adv, Mand), Machine Learning (High, Adv, Mand), Deep Learning (Medium, Inter, false)
(13, 1, 'High', 'Advanced', true),
(13, 15, 'High', 'Advanced', true),
(13, 16, 'Medium', 'Intermediate', false),
-- Technical Writer (Zoho - Id 14): Communication (High, Adv, Mand), Time Management (Medium, Beg, false)
(14, 25, 'High', 'Advanced', true),
(14, 28, 'Medium', 'Beginner', false),
-- IoT firmware (Intel - Id 15): C++ (High, Inter, Mand), Arduino (High, Adv, Mand)
(15, 5, 'High', 'Intermediate', true),
(15, 29, 'High', 'Advanced', true),
-- L&T Estimator (L&T - Id 16): AutoCAD (High, Inter, Mand), SolidWorks (Medium, Beg, false)
(16, 24, 'High', 'Intermediate', true),
(16, 23, 'Medium', 'Beginner', false);

-- 10. Saved Internships (10 entries)
INSERT INTO saved_internships (student_id, internship_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 2), (2, 4),
(3, 13), (3, 2),
(4, 13), (4, 1),
(5, 15);

-- 11. Applications (40 entries in different statuses)
INSERT INTO applications (student_id, internship_id, company_id, external_company_name, external_role_title, application_source, applied_date, current_status, priority, expected_stipend, notes, next_action, next_action_date) VALUES
-- Student 1 (Aarav): Applied to Google (Offer Accepted), Zoho (Withdrawn), Razorpay (Under Review)
(1, 1, 1, NULL, NULL, 'Internal', '2026-07-01', 'Offer Accepted', 'High', 90000.00, 'Top choice. Interviewed in early July.', 'Enjoy internship!', '2026-08-01'),
(1, 2, 2, NULL, NULL, 'Internal', '2026-07-02', 'Withdrawn', 'Medium', 30000.00, 'Withdrew since Google offer was accepted.', 'None', NULL),
(1, 3, 3, NULL, NULL, 'Internal', '2026-07-03', 'Under Review', 'High', 45000.00, 'Backend rounds went well.', 'Await review feedback', '2026-07-25'),
(1, NULL, 3, 'Razorpay (External)', 'UI Engineer', 'Indeed', '2026-06-15', 'Rejected', 'Low', 25000.00, 'Applied via Indeed. Got rejection email.', 'None', NULL),
-- Student 2 (Ananya): Applied to Zoho (Offer Accepted), Freshworks (Offer Declined), Infosys (Interview Scheduled)
(2, 2, 2, NULL, NULL, 'Internal', '2026-07-01', 'Offer Accepted', 'High', 30000.00, 'Accepted offer, starting next month.', 'Prepare onboarding docs', '2026-07-28'),
(2, 4, 6, NULL, NULL, 'Internal', '2026-07-02', 'Offer Declined', 'High', 25000.00, 'Declined since Zoho was remote.', 'None', NULL),
(2, 7, 5, NULL, NULL, 'Internal', '2026-07-05', 'Interview Scheduled', 'Medium', 20000.00, 'Technical round scheduled.', 'Revise CSS Grid / Flexbox', '2026-07-20'),
(2, NULL, 6, 'Freshworks (External)', 'JS Engineer', 'LinkedIn', '2026-06-20', 'Rejected', 'Low', 18000.00, 'Rejected after resume screening.', 'None', NULL),
-- Student 3 (Vihaan): Google AI (Under Review), Zoho Backend (Online Assessment), TCS (Applied)
(3, 13, 1, NULL, NULL, 'Internal', '2026-07-05', 'Under Review', 'High', 95000.00, 'Heavy NLP requirements.', 'Await shortlist announcement', '2026-07-30'),
(3, 2, 2, NULL, NULL, 'Internal', '2026-07-06', 'Online Assessment', 'Medium', 25000.00, 'FastAPI assessment test link received.', 'Complete Hackerearth coding test', '2026-07-18'),
(3, 6, 4, NULL, NULL, 'Internal', '2026-07-10', 'Applied', 'Low', 15000.00, 'Mass hiring applied.', 'Track email updates', '2026-08-01'),
(3, NULL, 1, 'Google (External)', 'General Analyst', 'Referral', '2026-06-10', 'Withdrawn', 'Low', 80000.00, 'Withdrawn due to matching constraints.', 'None', NULL),
-- Student 4 (Diya): Google AI (Offer Received), Google SWE (Offer Declined), Cred Data (Interview Completed)
(4, 13, 1, NULL, NULL, 'Internal', '2026-07-01', 'Offer Received', 'High', 100000.00, 'Received offer letter today. Awesome stipend!', 'Accept offer in dashboard', '2026-07-20'),
(4, 1, 1, NULL, NULL, 'Internal', '2026-07-02', 'Offer Declined', 'High', 90000.00, 'Declined in favor of AI Research role.', 'None', NULL),
(4, 8, 7, NULL, NULL, 'Internal', '2026-07-03', 'Interview Completed', 'Medium', 40000.00, 'Managerial round completed today.', 'Await feedback', '2026-07-22'),
(4, NULL, 7, 'Cred (External)', 'Product Analyst', 'LinkedIn', '2026-06-25', 'Rejected', 'Medium', 30000.00, 'Figma rounds were hard.', 'None', NULL),
-- Student 5 (Aditya): Intel IoT (Shortlisted), TCS (Applied), External IoT (Interested)
(5, 15, 11, NULL, NULL, 'Internal', '2026-07-05', 'Shortlisted', 'High', 38000.00, 'Shortlisted for firmware assessment.', 'Revise SPI/I2C communication', '2026-07-22'),
(5, 6, 4, NULL, NULL, 'Internal', '2026-07-10', 'Applied', 'Medium', 15000.00, 'Awaiting updates.', 'Wait', '2026-08-10'),
(5, NULL, 11, 'Embedded Tech Ltd (External)', 'IoT intern', 'Indeed', '2026-07-12', 'Interested', 'Low', 12000.00, 'Applied via career portal.', 'Follow-up email', '2026-07-25'),
-- Student 6 (Neha): Intel HW (Interview Scheduled), TCS (Applied), External VLSI (Applied)
(6, 5, 11, NULL, NULL, 'Internal', '2026-07-05', 'Interview Scheduled', 'High', 55000.00, 'Verilog coding round scheduled.', 'Revise FIFO designs and setup time', '2026-07-21'),
(6, 6, 4, NULL, NULL, 'Internal', '2026-07-10', 'Applied', 'Medium', 15000.00, 'Awaiting response.', 'None', NULL),
(6, NULL, 11, 'Wipro Hardware (External)', 'VLSI Designer', 'LinkedIn', '2026-07-01', 'Applied', 'Medium', 20000.00, 'Referral application.', 'Ask referrer for status', '2026-07-20'),
-- Student 7 (Rohan): Reliance Cloud (Applied), External Mechanical (Online Assessment)
(7, 10, 10, NULL, NULL, 'Internal', '2026-07-08', 'Applied', 'High', 25000.00, 'Interested in AWS automation.', 'Wait for review', '2026-08-01'),
(7, NULL, 10, 'Tata Motors (External)', 'CAD Intern', 'Referral', '2026-07-01', 'Online Assessment', 'Medium', 15000.00, 'Completed CAD aptitude test.', 'Await test results', '2026-07-18'),
-- Student 8 (Shruti): Zoho Writer (Applied), External Automation (Shortlisted)
(8, 14, 2, NULL, NULL, 'Internal', '2026-07-09', 'Applied', 'Medium', 20000.00, 'Writing test completed.', 'Await test score', '2026-07-24'),
(8, NULL, 2, 'Siemens (External)', 'Automation Specialist', 'Indeed', '2026-07-02', 'Shortlisted', 'High', 18000.00, 'Shortlisted for PLC test.', 'Prepare Siemens Step 7 PLC concepts', '2026-07-19'),
-- Student 9 (Vikram): L&T Estimator (Applied), External CAD (Applied)
(9, 16, 12, NULL, NULL, 'Internal', '2026-07-10', 'Applied', 'High', 11000.00, 'Quantity estimation focus.', 'None', NULL),
(9, NULL, 12, 'Ashoka Buildcon (External)', 'Site Intern', 'Career Page', '2026-07-04', 'Applied', 'Medium', 8000.00, 'Awaiting site manager contact.', 'Call HR', '2026-07-20'),
-- Student 10 (Sai): L&T Estimator (Applied), External Consultant (Applied)
(10, 16, 12, NULL, NULL, 'Internal', '2026-07-10', 'Applied', 'High', 11000.00, 'Looking for site experience.', 'None', NULL),
(10, NULL, 12, 'Shapoorji (External)', 'Civil Supervisor', 'Referral', '2026-07-01', 'Applied', 'High', 10000.00, 'Interview expected.', 'Follow up with supervisor', '2026-07-18'),
-- Additional external and historical entries to round up to 40
(1, NULL, 4, 'Infosys (External)', 'Python Trainee', 'LinkedIn', '2026-05-10', 'Rejected', 'Medium', 15000.00, 'Resume not shortlisted.', 'None', NULL),
(1, NULL, 5, 'Wipro (External)', 'Node Intern', 'Indeed', '2026-05-12', 'Rejected', 'Medium', 15000.00, 'Test was failed.', 'None', NULL),
(2, NULL, 2, 'Zoho (External)', 'Technical Writer', 'LinkedIn', '2026-05-15', 'Rejected', 'Low', 18000.00, 'Wrong role application.', 'None', NULL),
(3, NULL, 8, 'Flipkart (External)', 'Python Intern', 'Career Page', '2026-06-01', 'Rejected', 'Medium', 30000.00, 'No vacancy left.', 'None', NULL),
(4, NULL, 1, 'Google (External)', 'SWE Intern', 'Indeed', '2026-05-01', 'Rejected', 'High', 80000.00, 'First try failed.', 'None', NULL),
(5, NULL, 11, 'Intel (External)', 'Hardware Trainee', 'Referral', '2026-06-01', 'Rejected', 'High', 40000.00, 'Verilog rounds failed.', 'None', NULL),
(6, NULL, 11, 'Intel (External)', 'Firmware Dev', 'Indeed', '2026-06-05', 'Rejected', 'High', 35000.00, 'Insufficient coding skills.', 'None', NULL),
(7, NULL, 10, 'Reliance (External)', 'Power Intern', 'Career Page', '2026-06-01', 'Rejected', 'Medium', 15000.00, 'Expired opening.', 'None', NULL),
(8, NULL, 2, 'Zoho (External)', 'CRM Trainee', 'LinkedIn', '2026-06-10', 'Rejected', 'Low', 12000.00, 'Duplicate try.', 'None', NULL),
(9, NULL, 12, 'L&T (External)', 'CAD Draftsman', 'Indeed', '2026-06-01', 'Rejected', 'Medium', 10000.00, 'Rejected.', 'None', NULL);

-- 12. Status History (Auto-populated by triggers, but we can seed extra history details if needed)
-- (Triggers will auto-create the initial status and update changes, so no manual insert is strictly needed.
-- But let's add some manual historic entries to simulate past transitions)
INSERT INTO application_status_history (application_id, old_status, new_status, changed_by, change_note) VALUES
(1, 'Interested', 'Applied', 2, 'Student submitted application'),
(1, 'Applied', 'Under Review', 1, 'Admin updated status after screening resume'),
(1, 'Under Review', 'Interview Scheduled', 1, 'Admin scheduled interview round 1'),
(1, 'Interview Scheduled', 'Offer Received', 1, 'Admin recorded feedback and offered role'),
(5, 'Interested', 'Applied', 3, 'Applied on portal'),
(5, 'Applied', 'Under Review', 1, 'Admin review'),
(5, 'Under Review', 'Interview Scheduled', 1, 'Round 1 technical scheduled');

-- 13. Interviews (10 entries)
-- Note: inserting these will auto-trigger student notifications.
INSERT INTO interviews (application_id, interview_round, interview_type, scheduled_start, scheduled_end, meeting_link, location, interviewer_name, interview_status, preparation_notes, feedback_notes, result) VALUES
(1, 1, 'Coding', '2026-07-05 10:00:00+05:30', '2026-07-05 11:30:00+05:30', 'https://meet.google.com/abc-defg-hij', 'Google Meet', 'Rajesh Kumar', 'Completed', 'Solve Leetcode medium dynamic programming questions.', 'Candidate solved both questions and explained time complexities.', 'Passed'),
(1, 2, 'Technical', '2026-07-08 14:00:00+05:30', '2026-07-08 15:00:00+05:30', 'https://meet.google.com/xyz-pqrs-tuv', 'Google Meet', 'Sarah Jenkins', 'Completed', 'Revise OS, Networks and SQL joins.', 'Very strong OS and DB concepts. High recommened.', 'Passed'),
(5, 1, 'Technical', '2026-07-09 11:00:00+05:30', '2026-07-09 12:00:00+05:30', 'https://meet.zoho.com/api-auth', 'Zoho Meet', 'Ramanujam S.', 'Completed', 'FastAPI fundamentals, async-await in Python.', 'Decent API concepts. Ready for next manager round.', 'Passed'),
(7, 1, 'Technical', '2026-07-20 15:00:00+05:30', '2026-07-20 16:00:00+05:30', 'https://meet.google.com/lmn-opqr-stu', 'Google Meet', 'Priyanka Sen', 'Scheduled', 'CSS Grid, Flexbox alignment, React lifecycle methods.', 'N/A', 'Pending'),
(13, 1, 'Coding', '2026-07-06 09:00:00+05:30', '2026-07-06 10:30:00+05:30', 'https://meet.google.com/ai-rnd', 'Google Meet', 'Dr. Amit Patel', 'Completed', 'Review Transformers paper, PyTorch operations.', 'Excellent math foundation. Solved dynamic programming graph problem.', 'Passed'),
(13, 2, 'Technical', '2026-07-10 11:00:00+05:30', '2026-07-10 12:30:00+05:30', 'https://meet.google.com/ai-rnd-rnd', 'Google Meet', 'Sanjay Dutt', 'Completed', 'NLP embeddings, tokenizers, and LLM fine-tuning mechanics.', 'Candidate has strong research publication backing.', 'Passed'),
(15, 1, 'Technical', '2026-07-12 10:00:00+05:30', '2026-07-12 11:00:00+05:30', 'https://meet.google.com/cred-db', 'Google Meet', 'Vikramaditya', 'Completed', 'Distributed systems scaling, database indexes B-tree.', 'Excellent logic, database isolation details verified.', 'Passed'),
(20, 1, 'Coding', '2026-07-21 14:00:00+05:30', '2026-07-21 15:30:00+05:30', 'https://teams.microsoft.com/intel-hw', 'MS Teams', 'Kapil Dev', 'Scheduled', 'Verilog state machines, setup/hold slack formulas.', 'N/A', 'Pending'),
(23, 1, 'Coding', '2026-07-18 10:00:00+05:30', '2026-07-18 11:30:00+05:30', 'https://teams.microsoft.com/tm-cad', 'MS Teams', 'Anil Kumble', 'Scheduled', 'AutoCAD shortcuts, geometric tolerancing.', 'N/A', 'Pending'),
(28, 1, 'Technical', '2026-07-19 11:00:00+05:30', '2026-07-19 12:00:00+05:30', 'https://meet.google.com/siemens-plc', 'Google Meet', 'HR Siemens', 'Scheduled', 'Ladder logic diagrams, timers, and counter relays.', 'N/A', 'Pending');

-- 14. Offers (5 entries)
-- Note: inserting these will auto-trigger row audits.
INSERT INTO offers (application_id, offered_role, stipend_amount, currency, start_date, end_date, work_mode, location, offer_deadline, offer_status) VALUES
(1, 'Software Engineering Intern', 90000.00, 'INR', '2026-08-01', '2027-01-31', 'Hybrid', 'Bengaluru', '2026-07-25', 'Accepted'),
(5, 'Backend Developer Intern', 30000.00, 'INR', '2026-08-05', '2027-02-05', 'Remote', 'Chennai', '2026-07-28', 'Accepted'),
(6, 'Frontend Engineering Intern', 22000.00, 'INR', '2026-08-10', '2026-11-10', 'Remote', 'Chennai', '2026-07-25', 'Declined'),
(13, 'AI Research Intern', 100000.00, 'INR', '2026-08-01', '2027-01-31', 'Hybrid', 'Bengaluru', '2026-07-20', 'Pending'),
(14, 'Software Engineering Intern', 90000.00, 'INR', '2026-08-01', '2027-01-31', 'Hybrid', 'Bengaluru', '2026-07-20', 'Declined');

-- 15. Documents (Resume files for student profile completion)
INSERT INTO documents (student_id, application_id, document_type, original_filename, stored_filename, file_path, mime_type, file_size, verification_status) VALUES
(1, NULL, 'Resume', 'Aarav_Patel_CV.pdf', 'aarav_cv_129381.pdf', 'uploads/documents/aarav_cv_129381.pdf', 'application/pdf', 1024500, 'Verified'),
(2, NULL, 'Resume', 'Ananya_Iyer_Resume.pdf', 'ananya_cv_281938.pdf', 'uploads/documents/ananya_cv_281938.pdf', 'application/pdf', 980400, 'Verified'),
(3, NULL, 'Resume', 'Vihaan_Sharma_Profile.pdf', 'vihaan_cv_481932.pdf', 'uploads/documents/vihaan_cv_481932.pdf', 'application/pdf', 1100500, 'Verified'),
(4, NULL, 'Resume', 'Diya_Nair_CV_2026.pdf', 'diya_cv_982938.pdf', 'uploads/documents/diya_cv_982938.pdf', 'application/pdf', 1234900, 'Verified'),
(5, NULL, 'Resume', 'Aditya_V_Resume.pdf', 'aditya_cv_582910.pdf', 'uploads/documents/aditya_cv_582910.pdf', 'application/pdf', 870200, 'Verified'),
(6, NULL, 'Resume', 'Neha_Gupta_ECE.pdf', 'neha_cv_682019.pdf', 'uploads/documents/neha_cv_682019.pdf', 'application/pdf', 990400, 'Verified'),
(7, NULL, 'Resume', 'Rohan_Mehta_CV.pdf', 'rohan_cv_782910.pdf', 'uploads/documents/rohan_cv_782910.pdf', 'application/pdf', 1020400, 'Verified'),
(8, NULL, 'Resume', 'Shruti_Joshi_Resume.pdf', 'shruti_cv_892019.pdf', 'uploads/documents/shruti_cv_892019.pdf', 'application/pdf', 950200, 'Verified'),
(9, NULL, 'Resume', 'Vikram_Rao_Mech.pdf', 'vikram_cv_982019.pdf', 'uploads/documents/vikram_cv_982019.pdf', 'application/pdf', 1080400, 'Verified'),
(10, NULL, 'Resume', 'Sai_Prasad_Civil_Resume.pdf', 'sai_cv_108293.pdf', 'uploads/documents/sai_cv_108293.pdf', 'application/pdf', 900500, 'Verified');

-- Update profile completion percentage based on the trigger/function
UPDATE student_profiles SET profile_completion_percentage = calculate_profile_completion(student_id);

-- 16. Reminders
INSERT INTO reminders (student_id, application_id, title, description, reminder_datetime, reminder_type, is_completed) VALUES
(1, 3, 'Razorpay follow-up', 'Send email to HR regarding interview feedback.', '2026-07-26 10:00:00+05:30', 'Follow-up', false),
(2, 7, 'Revise React hooks', 'Prepare custom hooks and performance hook (useMemo, useCallback) questions.', '2026-07-19 18:00:00+05:30', 'Interview', false),
(3, 10, 'Zoho assessment due', 'Complete Zoho Hackerearth assessment link before expiry.', '2026-07-18 12:00:00+05:30', 'Deadline', false),
(4, 13, 'Accept Google AI Offer', 'Confirm acceptance of research internship in Google portal.', '2026-07-19 12:00:00+05:30', 'Deadline', false),
(5, 17, 'Firmware coding test prep', 'Revise bitwise operators and registers configurations.', '2026-07-21 20:00:00+05:30', 'Interview', false);

-- 17. Notifications
INSERT INTO notifications (user_id, title, message, notification_type, is_read) VALUES
(2, 'Welcome to InternTrack!', 'Hi Aarav, complete your profile to unlock custom skill-matching analytics.', 'System', true),
(2, 'Google Application Accepted', 'Congratulations! Your application status has been marked as Offer Accepted.', 'Application', false),
(3, 'Interview Scheduled', 'Your interview for Next.js specialist has been scheduled for 20th July.', 'Interview', false);

-- 18. Notes
INSERT INTO notes (student_id, application_id, title, content) VALUES
(1, 1, 'Google HR feedback', 'HR was friendly. Asked about my graduation timeline and location preference. Ready for Bengaluru hybrid.'),
(1, 3, 'Razorpay coding details', 'First round coding: Solved a string parsing problem and a dynamic programming array problem. Runtime was O(N).'),
(2, 2, 'Zoho documents required', 'Need to keep degree certificates, 10th/12th marks sheets, and Aadhaar card ready for onboarding.'),
(4, 13, 'Google AI research goals', 'The team is working on sparse attention models. Need to read FlashAttention-2 paper before start date.');

-- 19. Audit Logs
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values) VALUES
(1, 'SEED_SETUP', 'SYSTEM', 0, '{"message": "System database initialized with mock data"}');
