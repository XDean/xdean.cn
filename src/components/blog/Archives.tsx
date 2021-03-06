import {PostMetaGroup, PostMetaGroupType} from "../../posts/domain";
import {BlogHeaderView} from "./Header";
import {Typography} from "@material-ui/core";
import {MyLink} from "../util/Link";

type Props = {
  type: PostMetaGroupType
  groups: PostMetaGroup[]
}

export const ArchivesView = (props: Props) => {
  const label = typeToLabel(props.type)
  return (
    <div style={{maxWidth: 900, minWidth: '50%'}}>
      <div style={{marginBottom: 20}}>
        <BlogHeaderView/>
      </div>
      <Typography variant={"h4"}>
        所有{label}
      </Typography>
      <ul>
        {props.groups.map(e => (
          <li key={e.name} style={{fontSize: '1.5rem'}}>
            <MyLink href={`${props.type}/${e.name}`}>
              <Typography variant={"body1"} style={{fontSize: '1.5rem'}} component={'span'}>
                {e.name} ({e.count})
              </Typography>
            </MyLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function typeToLabel(type: PostMetaGroupType) {
  switch (type) {
    case "year":
      return '年份';
    case "category":
      return '分类';
    case "tag":
      return '标签';
    default:
      return 'Unknown'
  }
}