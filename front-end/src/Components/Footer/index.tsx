import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Context } from '../../Contexts/PaginationContext/Context';
import { Context as LanguageContext } from '../../Contexts/GeneralConfigContext/Context';

function PageArrow({
  destination,
  label,
  previous = false,
}: {
  destination: string;
  label: string;
  previous?: boolean;
}) {
  const Icon = previous ? ChevronLeft : ChevronRight;
  const icon = <Icon className="h-[30px] w-[30px]" aria-hidden="true" />;

  if (!destination)
    return (
      <span className="flex opacity-[.35]" aria-hidden="true">
        {icon}
      </span>
    );

  return (
    <Link
      className="footerLink flex text-ink no-underline"
      to={destination}
      aria-label={label}
      title={label}
    >
      {icon}
    </Link>
  );
}

function Footer() {
  const { pageState } = useContext(Context);
  const { currentLanguage } = useContext(LanguageContext).language;
  const { pathname } = useLocation();
  const isTutorial = pathname === '/' || pathname.startsWith('/tutorial');
  const en = currentLanguage === 'en-us';

  return (
    <div className="footerContainer flex w-[calc(100%_-_70px)] flex-col items-center px-[35px] py-0">
      {isTutorial && (
        <div className="navigatorContainer flex items-center gap-[7px]">
          <PageArrow
            destination={pageState.prevPage}
            label={en ? 'Previous tutorial page' : 'Página anterior do tutorial'}
            previous
          />
          {pageState.listOfPages.map((page, index) => {
            const isCurrentPage = index === pageState.currentPageIndex;

            return (
              <Link
                key={page}
                to={page}
                aria-label={`Tutorial ${index + 1}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                <div
                  className={`page h-[10px] w-[10px] cursor-pointer rounded-[50%] ${isCurrentPage ? 'active bg-canvas' : 'bg-[#0000003d]'}`}
                />
              </Link>
            );
          })}
          <PageArrow
            destination={pageState.nextPage}
            label={en ? 'Next tutorial page' : 'Próxima página do tutorial'}
          />
        </div>
      )}
      <p className="copyrightText w-full text-center text-[10px]">
        © 2023 Matheus Alencar Garcia, Codeby
      </p>
    </div>
  );
}
export default Footer;
