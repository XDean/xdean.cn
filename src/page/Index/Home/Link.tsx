import clsx from 'clsx';
import { easeInOut, windowSmoothScroll } from '../../../../common/util/dom';
import css from './index.module.css';

type Props = {
  text: string
  link: string
}

export const Link = (props: Props) => {
  const {text, link} = props;
  return (
    <a href={link}
       className={clsx(css.link,
         'inline-block px-2 py-1 rounded-lg text-white',
         'transition hover:text-gray-700 hover:bg-white')}
       onClick={e => {
         if (link.startsWith('#')) {
           e.preventDefault();
           windowSmoothScroll({
             el: document.getElementById(link.slice(1)),
             duration: 500,
             stepFunc: easeInOut,
             force: true,
           });
         }
       }}
    >
      {text}
    </a>
  );
};