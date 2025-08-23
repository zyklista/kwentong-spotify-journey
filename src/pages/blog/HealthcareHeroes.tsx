import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import healthcareImage from "@/assets/blog/healthcare-heroes.jpg";

const HealthcareHeroes = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <article className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            
            <header className="mb-12">
              <img 
                src={healthcareImage} 
                alt="Filipino healthcare workers making a difference" 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Healthcare Heroes Abroad
              </h1>
              <div className="text-muted-foreground mb-6">
                <time>February 5, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Filipino healthcare workers making a difference around the world.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                🏥 Filipino healthcare workers are among the most respected and sought-after professionals worldwide. Their combination of excellent technical skills, compassionate care, and strong work ethic has made them indispensable in hospitals, clinics, and healthcare facilities across the globe.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Global Demand for Filipino Healthcare Workers</h2>
              <p>
                🌍 <strong>Countries actively recruiting Filipino healthcare professionals:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>United States:</strong> Highest salaries, advanced technology, career growth</li>
                <li><strong>United Kingdom:</strong> NHS opportunities, clear career pathways</li>
                <li><strong>Australia:</strong> High quality of life, excellent benefits</li>
                <li><strong>Canada:</strong> Immigration opportunities, multicultural environment</li>
                <li><strong>Middle East:</strong> Tax-free salaries, modern facilities</li>
                <li><strong>Germany:</strong> Growing demand, strong healthcare system</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Nursing: The Leading Export</h2>
              <p>
                👩‍⚕️ <strong>Filipino nurses are globally recognized for excellence:</strong> The Philippines produces some of the world\'s best-trained nurses, with rigorous education standards and practical training.
              </p>
              
              <p>
                <strong>Why Filipino nurses are in demand:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>English proficiency and communication skills</li>
                <li>Strong clinical competencies</li>
                <li>Cultural sensitivity and patient care</li>
                <li>Adaptability to different healthcare systems</li>
                <li>Dedication and work ethic</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Other Healthcare Professions</h2>
              <p>
                🏥 <strong>Beyond nursing, many healthcare roles are available:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Medical Technologists:</strong> Laboratory and diagnostic work</li>
                <li><strong>Physical Therapists:</strong> Rehabilitation services</li>
                <li><strong>Pharmacists:</strong> Medication management and counseling</li>
                <li><strong>Radiologic Technologists:</strong> Medical imaging</li>
                <li><strong>Occupational Therapists:</strong> Helping patients regain independence</li>
                <li><strong>Respiratory Therapists:</strong> Breathing and lung care</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Preparation and Licensing</h2>
              <p>
                📋 <strong>Steps to work as a healthcare professional abroad:</strong>
              </p>
              
              <p>
                <strong>For Nurses:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pass local nursing board exams (NCLEX-RN for US, OSCE for UK)</li>
                <li>Complete language proficiency tests (IELTS, OET)</li>
                <li>Obtain visa and work permits</li>
                <li>Complete orientation and competency programs</li>
              </ul>
              
              <p>
                <strong>General Requirements:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Credential evaluation and equivalency assessment</li>
                <li>Background checks and health screenings</li>
                <li>Professional liability insurance</li>
                <li>Continuing education requirements</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Career Advancement Opportunities</h2>
              <p>
                📈 <strong>Growing your healthcare career abroad:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Specialization:</strong> ICU, Emergency, Operating Room, Pediatrics</li>
                <li><strong>Advanced Practice:</strong> Nurse Practitioner, Clinical Specialist</li>
                <li><strong>Leadership:</strong> Charge Nurse, Unit Manager, Director</li>
                <li><strong>Education:</strong> Clinical Instructor, Nursing Faculty</li>
                <li><strong>Research:</strong> Clinical Research, Quality Improvement</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Challenges in Healthcare Abroad</h2>
              <p>
                ⚠️ <strong>Common challenges and how to overcome them:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cultural differences:</strong> Learn local healthcare customs and patient expectations</li>
                <li><strong>Technology gaps:</strong> Stay updated with new medical technologies</li>
                <li><strong>Language barriers:</strong> Master medical terminology in local language</li>
                <li><strong>Licensing delays:</strong> Start the process early and be patient</li>
                <li><strong>Homesickness:</strong> Build support networks and maintain connections</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Making a Difference</h2>
              <p>
                ❤️ <strong>Stories of impact and recognition:</strong>
              </p>
              
              <p>
                Filipino healthcare workers have been recognized worldwide for their contributions, especially during the COVID-19 pandemic. They have received national honors, professional awards, and community recognition for their dedication and service.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Financial Rewards</h2>
              <p>
                💰 <strong>Healthcare offers excellent earning potential:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Competitive base salaries</li>
                <li>Overtime and shift differential pay</li>
                <li>Comprehensive benefits packages</li>
                <li>Retirement and pension plans</li>
                <li>Professional development funding</li>
              </ul>
              
              <p>
                🌟 Healthcare is more than a career - it is a calling to serve and heal. Filipino healthcare workers carry with them the Filipino values of compassion, dedication, and excellence, making them not just employees but ambassadors of care wherever they serve.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default HealthcareHeroes;