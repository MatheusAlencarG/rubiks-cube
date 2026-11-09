import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Context } from '../../Contexts/PaginationContext/Context';

function PageArrow({ destination, previous = false }: { destination: string; previous?: boolean }) {
  const image = (
    <img
      className={`pageImage w-[30px] [filter:var(--ink-icon-filter)] ${previous ? 'rotate-180' : ''}`}
      src={`/images/simple-arrow${destination ? '' : '-grey'}.svg`}
      alt={previous ? 'Prev Arrow' : 'Next Arrow'}
    />
  );

  return (
    <div
      className={`flex text-[30px] ${previous ? 'prevPage' : 'nextPage'} ${destination ? 'active cursor-pointer' : ''}`}
    >
      {destination ? (
        <Link className="footerLink flex text-ink no-underline" to={destination}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
}

function Footer() {
  const { pageState } = useContext(Context);
  const { pathname } = useLocation();
  const isTutorial = pathname === '/' || pathname.startsWith('/tutorial');

  return (
    <div className="footerContainer flex w-[calc(100%_-_70px)] flex-col items-center px-[35px] py-0">
      {isTutorial && (
        <div className="navigatorContainer flex items-center gap-[7px]">
          <PageArrow destination={pageState.prevPage} previous />
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
          <PageArrow destination={pageState.nextPage} />
        </div>
      )}
      <p className="copyrightText w-full text-center text-[10px]">
        © 2023 Matheus Alencar Garcia, Codeby
      </p>
    </div>
  );
}
export default Footer;
