import Link from 'next/link';

import { FC } from 'react';
interface PaginateProps {
  pages: number;
  page: number;
  isAdmin?: boolean;
  keyword?: string;
}

const Paginate: FC<PaginateProps> = ({ pages, page, isAdmin = false, keyword = '' }) => {
    return (
      <div>
        {Array.from({ length: pages }, (_, i) => (
          <Link key={i} href={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${i + 1}`
                : `/page/${i + 1}`
              : `/admin/productlist/${i + 1}`
          }>
            <a className={i + 1 === page ? 'active' : ''}>{i + 1}</a>
          </Link>
        ))}
      </div>
    );
  };
  
  export default Paginate;