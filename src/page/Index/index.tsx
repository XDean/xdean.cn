import { useCallback, useEffect, useState } from 'react';
import { easeInOut, smoothScroll } from '../../../common/util/dom';
import { PropsOf } from '../../../common/util/react';
import { About } from './About';
import { BoardGame } from './BoardGame';
import { Coding } from './Coding';
import { Home } from './Home';
import css from './index.module.css';
import { Reed } from './Reed';
import Timeout = NodeJS.Timeout;

type Props = {
  home: PropsOf<typeof Home>
}

export const Index = (props: Props) => {
  const [root, setRoot] = useState<HTMLDivElement>();
  const {home} = props;

  useEffect(() => {
    if (root && window) {
      let lastPos = window.scrollY;
      let scrollDown = true;
      let scrolling = false;
      let taskId: Timeout;
      const listener = () => {
        scrollDown = window.scrollY > lastPos;
        lastPos = window.scrollY;
        if (scrolling) {
          return;
        }
        clearTimeout(taskId);
        let target: Element;
        for (let i = 0; i < root.children.length; i++) {
          const c = root.children.item(i);
          const offset = c.getBoundingClientRect().y;
          if (offset === 0) {
            history.replaceState(null, null, `#${c.id}`);
            return;
          } else if (offset > 0) {
            if (offset > window.innerHeight / 4 * 3) {
              target = c.previousElementSibling!;
            } else if (offset < window.innerHeight / 4) {
              target = c;
            } else if (scrollDown) {
              target = c;
            } else {
              target = c.previousElementSibling!;
            }
            break;
          }
        }
        if (target) {
          const targetPos = window.scrollY + target.getBoundingClientRect().y;
          taskId = setTimeout(() => {
            scrolling = true;
            history.replaceState(null, null, `#${target.id}`);
            smoothScroll({
              element: window,
              from: lastPos,
              to: targetPos,
              onFinal: () => scrolling = false,
              duration: Math.max(Math.min(500, (targetPos - lastPos) / 2), 100),
              stepFunc: easeInOut,
            });
          }, 300);
        }
      };
      window.addEventListener('scroll', listener);
      return () => {
        window.removeEventListener('scroll', listener);
      };
    }
  }, [root]);

  const scrollTo = useCallback((id: string) => {
    if (root) {
      for (let i = 0; i < root.children.length; i++) {
        const c = root.children.item(i);
        if (c.id === id) {
          smoothScroll({
            element: window,
            from: window.scrollY,
            to: window.scrollY + c.getBoundingClientRect().y,
            duration: 500,
            stepFunc: easeInOut,
            force: true,
          });
        }
      }
    }
  }, [root]);

  return (
    <div id={'root'} className={css.root} ref={setRoot}>
      <div id={'home'} className={css.page}>
        <div>
          <Home {...home}/>
        </div>
      </div>
      <div id={'about'} className={css.page}>
        <div>
          <About/>
        </div>
      </div>
      <div id={'coding'} className={css.page}>
        <div>
          <Coding/>
        </div>
      </div>
      <div id={'board-game'} className={css.page}>
        <div className={'text-4xl'}>
          TBD
        </div>
      </div>
      <div id={'cook'} className={css.page}>
        <div className={'text-4xl'}>
          TBD
        </div>
      </div>
      <div id={'reed'} className={css.page}>
        <div>
          <Reed/>
        </div>
      </div>
    </div>
  );
};
