import Title from "@/app/components/Title";
import React from "react";
import {
  PiEnvelopeDuotone,
  PiLinkedinLogoDuotone,
  PiTwitterLogoDuotone,
} from "react-icons/pi";
import { EMAIL, LINKEDIN, TWITTER } from "../data/basic";

const GetInTouch: React.FC = () => {
  return (
    <div className="gap-8 p-6" id="contact">
      <Title title="Dive into my chronicles" />
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        {/* Left Side - Blog Section */}
        <div className="w-full md:w-1/2">
          <div className="bg-base-200 rounded-lg shadow-md p-6 h-[400px] sm:h-[300px] md:h-[350px] lg:h-[250px]">
            <h2 className="text-2xl font-bold mb-4">Explore My Blogs</h2>
            <div className="space-y-4">
              <p className="text-base-content mb-4">
                Embark on a journey of knowledge with my exclusive newsletter.
                Stay ahead with captivating insights, thought-provoking
                interviews, and expert tips. Subscribe now for your regular dose
                of valuable content delivered straight to your inbox.
              </p>
            </div>
            <div className="mt-6">
              <button className="btn btn-primary">View Blogs</button>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Card */}
        <div className="w-full md:w-1/2">
          <div className="bg-base-200 rounded-lg shadow-md p-6 h-[400px] sm:h-[300px] md:h-[350px] lg:h-[250px]">
            <h2 className="text-2xl font-bold mb-4">Let&lsquo;s Connect</h2>
            <p className="text-base-content mb-4">
              Feel free to reach out for collaborations, opportunities, or just
              to say hello!
            </p>
            <div className="space-y-4 space-x-10 mt-14">
              <a
                href={`mailto:${EMAIL}`}
                className="p-3 bg-base-300 rounded-full hover:bg-primary/20 transition-colors tooltip"
                data-tip={EMAIL}
              >
                <PiEnvelopeDuotone className="text-2xl" />
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-base-300 rounded-full hover:bg-primary/20 transition-colors tooltip"
                data-tip="LinkedIn Profile"
              >
                <PiLinkedinLogoDuotone className="text-2xl" />
              </a>
              <a
                href={TWITTER}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-base-300 rounded-full hover:bg-primary/20 transition-colors tooltip"
                data-tip="Twitter Profile"
              >
                <PiTwitterLogoDuotone className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;
