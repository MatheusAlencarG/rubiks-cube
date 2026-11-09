import React, { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import Disclosure from '../Disclosure';

const contentClasses = {
  language: 'flex flex-wrap justify-center gap-[20px]',
  preferences: 'text-left normal-case',
};

interface SettingsSectionProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  variant?: keyof typeof contentClasses;
}

export default function SettingsSection({
  title,
  icon: Icon,
  children,
  variant = 'preferences',
}: SettingsSectionProps) {
  return (
    <section className="w-4/5 rounded-[15px] border-2 border-solid border-accent capitalize">
      <Disclosure
        title={
          <>
            <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span>{title}</span>
          </>
        }
        buttonClass="m-0 grid min-h-[45px] cursor-pointer grid-cols-[24px_minmax(0,1fr)_24px] items-center gap-2 rounded-[10px] bg-accent px-2 py-1 text-center font-bold capitalize text-on-accent"
        contentClass="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none [&.active]:grid-rows-[1fr]"
        arrowClass="h-6 w-6 duration-300"
      >
        <div className="min-h-0 overflow-hidden">
          <div className={`${contentClasses[variant]} p-[15px]`}>{children}</div>
        </div>
      </Disclosure>
    </section>
  );
}
