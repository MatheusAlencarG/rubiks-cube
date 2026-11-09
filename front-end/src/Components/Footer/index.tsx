import React, { useContext } from 'react';
import './styles.css';
import { Link, useLocation } from 'react-router-dom';
import { Context } from '../../Contexts/PaginationContext/Context';

function PageArrow({ destination, previous = false }: { destination: string; previous?: boolean }) {
  const image = (
    <img
      className="pageImage w-[30px]"
      src={`/images/simple-arrow${destination ? '' : '-grey'}.svg`}
      alt={previous ? 'Prev Arrow' : 'Next Arrow'}
    />
  );
  return (
    <div className={`${previous ? 'prevPage' : 'nextPage'} ${destination ? 'active' : ''}`}>
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
          {pageState.listOfPages.map((page, index) => (
            <Link
              key={page}
              to={page}
              aria-label={`Tutorial ${index + 1}`}
              aria-current={index === pageState.currentPageIndex ? 'page' : undefined}
            >
              <div className={`page ${index === pageState.currentPageIndex ? 'active' : ''}`} />
            </Link>
          ))}
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
