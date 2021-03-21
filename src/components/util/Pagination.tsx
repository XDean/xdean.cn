import {PageData} from "../../util/util";
import {Pagination} from "@material-ui/lab";
import * as React from "react";
import {PaginationProps} from "@material-ui/lab/Pagination/Pagination";

export type MyPaginationProps = {
  data: PageData<any>
  onPageChange?: (page: number) => void
} & Partial<PaginationProps>

export const MyPagination = ({data, onPageChange, ...rest}: MyPaginationProps) => {
  if (data.total === 1) {
    return null
  }
  return <Pagination count={data.total} color={"primary"} variant={"outlined"} page={data.page}
                     style={{width: 'fit-content', margin: '0 auto'}}
                     onChange={onPageChange && ((e, v) => onPageChange(v))}
                     {...rest}
  />
}
