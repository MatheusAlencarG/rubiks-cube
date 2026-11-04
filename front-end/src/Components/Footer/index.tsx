import React, { useContext } from 'react';
import './styles.css';
import { Context } from '../../Contexts/PaginationContext/Context';

import { Link } from 'react-router-dom';

function Footer() {
  const { pageState, nextPage, prevPage, changePageState } = useContext(Context);

  function verifyPage(): boolean {
    return window.location.pathname.includes('tutorial') || window.location.pathname === '/';
  }

  function verifyPrevPage(): boolean {
    return pageState.prevPage !== '';
  }

  function verifyNextPage(): boolean {
    return pageState.nextPage !== '';
  }

  return (
    <div className="footerContainer flex w-[calc(100%_-_70px)] flex-col items-center px-[35px] py-0">
      {verifyPage() && (
        <div className="navigatorContainer flex items-center gap-[7px]">
          {verifyPrevPage() ? (
            <div className="prevPage active">
              <Link
                onClick={prevPage}
                className="footerLink flex text-canvas no-underline"
                to={pageState.prevPage}
              >
                <img
                  className="pageImage w-[30px]"
                  src="/images/simple-arrow.svg"
                  alt="Prev Arrow"
                />
              </Link>
            </div>
          ) : (
            <div className="prevPage">
              <img
                className="pageImage w-[30px]"
                src="/images/simple-arrow-grey.svg"
                alt="Prev Arrow"
              />
            </div>
          )}
          {pageState.listOfPages.map((page, index) => {
            return (
              <Link
                key={index}
                to={page}
                onClick={() => changePageState({ newcurrentPageIndex: index })}
              >
                <div
                  className={`page ${pageState.listOfPages.indexOf(page) === pageState.currentPageIndex ? 'active' : ''}`}
                ></div>
              </Link>
            );
          })}
          {verifyNextPage() ? (
            <div className="nextPage active">
              <Link
                onClick={nextPage}
                className="footerLink flex text-canvas no-underline"
                to={pageState.nextPage}
              >
                <img
                  className="pageImage w-[30px]"
                  src="/images/simple-arrow.svg"
                  alt="Next Arrow"
                />
              </Link>
            </div>
          ) : (
            <div className="nextPage">
              <img
                className="pageImage w-[30px]"
                src="/images/simple-arrow-grey.svg"
                alt="Prev Arrow"
              />
            </div>
          )}
        </div>
      )}
      <p className="copyrightText w-full text-center text-[10px]">
        © 2023 Matheus Alencar Garcia, Codeby
      </p>
    </div>
  );
}

export default Footer;
