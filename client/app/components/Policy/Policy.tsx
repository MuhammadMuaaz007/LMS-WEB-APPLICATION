"use client";
import React from "react";
import { 
  HiOutlineShieldCheck, 
  HiOutlineDocumentText, 
  HiOutlineCurrencyDollar, 
  HiOutlineAcademicCap, 
  HiOutlineUserGroup, 
  HiOutlineEye,
  HiOutlineScale
} from "react-icons/hi";

interface PolicyCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ title, icon, content }) => {
  return (
    <div className="w-full border-b border-gray-200/60 dark:border-white/5 py-8 transition-all duration-300">
      <div className="w-[92%] max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-10 gap-4 items-start">
        {/* Title Block with Icon */}
        <div className="md:col-span-3 flex items-center gap-3">
          <div className="text-xl text-[#37a39a] p-2.5 rounded-xl bg-[#37a39a]/10 shrink-0">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-black dark:text-white font-Poppins tracking-wide">
            {title}
          </h2>
        </div>
        
        {/* Content Block */}
        <div className="md:col-span-7 pl-0 md:pl-4">
          <p className="text-[13.5px] leading-relaxed text-slate-600 dark:text-gray-400 font-Poppins whitespace-pre-line">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

const Policy = () => {
  return (
    <div className="w-full text-slate-800 dark:text-gray-200 font-Poppins pb-12">
      
      {/* HERO HEADER SECTION (Matches About Page Hero Theme) */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-8 md:pt-12 mb-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white leading-tight">
          Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37a39a] to-[#2bbca2]">Terms & Policies</span>
        </h1>
        <p className="text-[15px] md:text-[16px] text-slate-500 dark:text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
          Please review the legal parameters and community guidelines governing your interactive space inside the SkillStack academy system.
        </p>
      </div>

      {/* FULL-WIDTH DATA SECTIONS (Matches Core Vision Grid System Styling) */}
      <div className="w-full divide-y divide-gray-200/60 dark:divide-white/5 border-t border-b border-gray-200/60 dark:border-white/5">
        
        <PolicyCard 
          title="1. Privacy Policy" 
          icon={<HiOutlineShieldCheck />}
          content="We collect user data including names, emails, course progress, and payment information. This data helps us improve the platform and deliver content effectively. We use cookies and analytics tools to understand usage patterns. Your data is securely stored, and you have rights to access, edit, or delete your personal information."
        />

        <PolicyCard 
          title="2. Terms of Service" 
          icon={<HiOutlineDocumentText />}
          content="By using our platform, you agree to create an account, maintain its security, and follow community rules. Subscriptions and purchases are subject to specific pricing and refund terms. You may not share course content or engage in dishonest behavior. We reserve the right to suspend accounts that violate these terms."
        />

        <PolicyCard 
          title="3. Refund Policy" 
          icon={<HiOutlineCurrencyDollar />}
          content="Users may request a full refund within 7 days of purchase, provided that no more than 20% of the course has been completed. Refunds are not granted for downloadable content or dissatisfaction unless there is a technical issue on our side."
        />

        <PolicyCard 
          title="4. Honor Code" 
          icon={<HiOutlineAcademicCap />}
          content="We expect all learners to act with integrity. Plagiarism, copying answers, or cheating in any form is strictly prohibited. Violations may result in account suspension and revoked certificates."
        />

        <PolicyCard 
          title="5. Accessibility" 
          icon={<HiOutlineEye />}
          content="Our platform strives to be accessible to all learners. We follow WCAG 2.1 standards and support features such as screen readers and video captioning where available."
        />

        <PolicyCard 
          title="6. Community Guidelines" 
          icon={<HiOutlineUserGroup />}
          content="We encourage respectful communication and collaboration. No harassment, hate speech, spamming, or unrelated promotions are allowed. Let's build a safe and positive learning space together."
        />

        <PolicyCard 
          title="7. Copyright Policy" 
          icon={<HiOutlineScale />}
          content="All content on this platform is owned by us or our instructors. You may not download, reproduce, or redistribute any materials without explicit permission. If you believe your copyright is being violated, please contact us immediately."
        />

      </div>

      {/* FOOTER CALL-TO-ACTION NOTE (Matches About Page Footer Blurb) */}
      <div className="mt-16 text-center max-w-xl mx-auto py-6 border-t border-gray-200/50 dark:border-white/5">
        <h3 className="text-lg font-semibold text-black dark:text-white font-Poppins">
          Have questions regarding our compliance framework?
        </h3>
        <p className="text-[13px] text-slate-500 dark:text-gray-400 mt-1">
          Reach out to our operations team at compliance@skillstack.com for comprehensive architectural or account inquiries.
        </p>
      </div>
      
    </div>
  );
};

export default Policy;