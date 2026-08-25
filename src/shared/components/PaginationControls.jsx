import Pagination from './Pagination';

export default function PaginationControls(props) {
  const normalizedProps = {
    ...props,
    onPageChange: props.onPageChange ?? props.goToPage,
    onNextPage: props.onNextPage ?? props.nextPage,
    onPrevPage: props.onPrevPage ?? props.prevPage,
  };

  return <Pagination {...normalizedProps} />;
}

export { Pagination };
export const PaginationControl = Pagination;
