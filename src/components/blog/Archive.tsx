import {PageData} from "../../util/util";
import {PostMeta, PostMetaGroupType} from "../../posts/domain";
import Link from "next/link";
import {format} from "date-fns";
import {MyLink} from "../util/Link";
import {Breadcrumbs, Divider, Typography} from "@material-ui/core";
import {typeToLabel} from "./Archives";
import {BlogHeaderView} from "./Header";
import {MyPagination} from "../util/Pagination";
import {useCallback} from "react";
import {useRouter} from "next/router";
import { motion } from "framer-motion";
import {OpacityInOut} from "../../motion/OpacityInOut";

type Props = {
  type: PostMetaGroupType
  name: string
  data: PageData<PostMeta>
}

export const ArchiveView = (props: Props) => {
  const router = useRouter()
  const onPageChange = useCallback((event, value: number) => {
    router.push(`/blog/archives/${props.type}/${props.name}/${value}`)
  }, [])
  return (
    <motion.div className={'w-11/12 max-w-screen-lg'} {...OpacityInOut}>
      <div className={'mb-4'}>
        <BlogHeaderView/>
      </div>
      <Breadcrumbs style={{fontSize: '2rem', color: 'inherit'}}>
        <MyLink href={`/blog/archives/${props.type}`}>
          <Typography style={{fontSize: 'inherit'}}>
            {typeToLabel(props.type)}
          </Typography>
        </MyLink>
        <Typography style={{fontSize: 'inherit'}}>
          {props.name}
        </Typography>
      </Breadcrumbs>
      <ul className={'list-disc pl-8'}>
        {props.data.data.map(e => {
          const date = new Date(e.created);
          return (
            <li key={e.path} style={{fontSize: '1.3rem'}}>
              <MyLink href={e.link} key={e.path}>
                {format(date, 'yyyy-MM-dd')} - {e.title}
              </MyLink>
            </li>
          );
        })}
      </ul>
      <MyPagination data={props.data} onChange={onPageChange}/>
    </motion.div>
  )
}