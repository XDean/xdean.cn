import Head from 'next/head'
import {MyLink} from "../util/Link";

export const ToolsView = () => {
  return (
    <div>
      <Head>
        <title>工具箱 - XDean</title>
      </Head>
      <div className={'text-3xl my-4'}>
        XDean的工具箱
      </div>
      <ul className={'list-disc'}>
        <li>
          <MyLink href={'/tools/guobiao'}>
            国标麻将算番器
          </MyLink>
        </li>
      </ul>
    </div>
  )
}