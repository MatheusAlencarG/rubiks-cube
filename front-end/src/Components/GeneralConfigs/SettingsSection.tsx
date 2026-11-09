import React, { ReactNode } from 'react';

import Disclosure from '../Disclosure';

const contentClasses = {
  language:
    'flex h-0 flex-wrap justify-center gap-[20px] overflow-hidden p-0 [transition:0.8s] [&.active]:h-fit [&.active]:p-[15px]',
  preferences:
    'h-0 overflow-hidden p-0 text-left normal-case [&.active]:h-auto [&.active]:p-[15px]',
};

interface SettingsSectionProps {
  title: ReactNode;
  children: ReactNode;
  variant?: keyof typeof contentClasses;
}

export default function SettingsSection({
  title,
  children,
  variant = 'preferences',
}: SettingsSectionProps) {
  return (
    <section className="w-4/5 rounded-[15px] border-2 border-solid border-accent capitalize">
      <Disclosure
        title={title}
        buttonClass="relative m-0 flex min-h-[45px] cursor-pointer items-center justify-center gap-[10px] rounded-[10px] bg-accent p-0 font-bold capitalize text-black"
        contentClass={contentClasses[variant]}
        arrowClass="absolute right-0 top-[calc(50%-17.5px)] w-[35px] cursor-pointer [filter:var(--accent-icon-filter)] [transform:rotate(90deg)] [transition:0.5s] [&.active]:[transform:rotate(270deg)]"
        arrowSrc="/images/simple-arrow.svg"
        arrowAlt="Simple Arrow"
      >
        {children}
      </Disclosure>
    </section>
  );
}
