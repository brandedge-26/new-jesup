import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Jesup Wireless",
};

const sections = [
  {
    title: "Consent",
    body: "By using our website, you hereby consent to our Privacy Policy and agree to its terms.",
  },
  {
    title: "Information We Collect",
    body: `The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.

If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.

When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.`,
  },
  {
    title: "How We Use Your Information",
    body: "We use the information we collect in various ways, including to:",
    list: [
      "Provide, operate, and maintain our website",
      "Improve, personalize, and expand our website",
      "Understand and analyze how you use our website",
      "Develop new products, services, features, and functionality",
      "Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes",
      "Send you emails",
      "Find and prevent fraud",
    ],
  },
  {
    title: "Log Files",
    body: "jesupwireless.com follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.",
  },
  {
    title: "Cookies and Web Beacons",
    body: "Like any other website, jesupwireless.com uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.",
  },
  {
    title: "Google DoubleClick DART Cookie",
    body: "Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.",
  },
  {
    title: "Advertising Partners Privacy Policies",
    body: "You may consult this list to find the Privacy Policy for each of the advertising partners of jesupwireless.com.\n\nThird-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on jesupwireless.com, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.\n\nNote that jesupwireless.com has no access to or control over these cookies that are used by third-party advertisers.",
  },
  {
    title: "Third Party Privacy Policies",
    body: "jesupwireless.com's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.\n\nYou can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.",
  },
  {
    title: "CCPA Privacy Rights (Do Not Sell My Personal Information)",
    body: "Under the CCPA, among other rights, California consumers have the right to:",
    list: [
      "Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.",
      "Request that a business delete any personal data about the consumer that a business has collected.",
      "Request that a business that sells a consumer's personal data, not sell the consumer's personal data.",
    ],
    footer: "If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.",
  },
  {
    title: "GDPR Data Protection Rights",
    body: "We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:",
    list: [
      "The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.",
      "The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.",
      "The right to erasure – You have the right to request that we erase your personal data, under certain conditions.",
      "The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.",
      "The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.",
      "The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.",
    ],
    footer: "If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.",
  },
  {
    title: "Children's Information",
    body: "Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.\n\njesupwireless.com does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-gray-950 px-6 lg:px-16 2xl:px-24 py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">
            Jesup Wireless, Inc. &nbsp;·&nbsp; Effective as of January 1, 2024
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 lg:px-16 2xl:px-24 py-14">
        <div className="max-w-3xl">

          {/* Intro */}
          <p className="text-gray-600 text-sm leading-relaxed mb-10">
            At <span className="font-medium text-gray-900">jesupwireless.com</span>, accessible from{" "}
            <a href="https://www.jesupwireless.com" className="text-primary hover:text-primary-hover underline underline-offset-2">
              https://www.jesupwireless.com
            </a>
            , one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by jesupwireless.com and how we use it.
            <br /><br />
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to{" "}
            <Link href="/contact" className="text-primary hover:text-primary-hover underline underline-offset-2">contact us</Link>.
            <br /><br />
            This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in jesupwireless.com. This policy is not applicable to any information collected offline or via channels other than this website.
          </p>

          {/* Sections */}
          <div className="flex flex-col gap-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h2>
                {s.body.split("\n\n").map((para, i) => (
                  <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">{para}</p>
                ))}
                {s.list && (
                  <ul className="mt-2 flex flex-col gap-2 pl-4">
                    {s.list.map((item) => (
                      <li key={item} className="text-gray-600 text-sm leading-relaxed list-disc list-outside">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {s.footer && (
                  <p className="text-gray-600 text-sm leading-relaxed mt-3">{s.footer}</p>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-14 rounded-2xl bg-gray-50 border border-gray-100 px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">Still have questions?</p>
              <p className="text-gray-500 text-sm">Our team is happy to help you understand your rights.</p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors shrink-0"
            >
              Contact us
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
