import {Interpreter} from "xstate";
import {WerewordContext, WerewordEvent, WerewordSchema} from "./machine";
import {useService} from "@xstate/react";
import {WerewordImages} from './Images'
import {WerewordToolbar} from "./Toolbar";

export const WerewordDayTime = ({service}: { service: Interpreter<WerewordContext, WerewordSchema, WerewordEvent> }) => {
  const [state, send] = useService(service)
  return (
    <>
      <div className={'w-max m-auto relative'}>
        <div className={'absolute -left-20'}>
          <WerewordToolbar service={service}/>
        </div>
        <WerewordImages.Logo/>
      </div>
      <div className={'flex-grow w-full relative'}>
        {state.matches('play.daytime.guess') && (
          <div>
            <div className={'text-center text-5xl my-4'}>
              猜词阶段
            </div>
            <div className={'text-center text-3xl mb-4'}>
              剩余({state.context.leftSeconds}秒)
            </div>
            <div className={'flex items-center justify-evenly'}>
              <div className={''} onClick={() => send('CORRECT')}>
                <WerewordImages.Correct/>
              </div>
              <div className={''} onClick={() => send('NO_TOKEN')}>
                <WerewordImages.NoToken/>
              </div>
            </div>

          </div>
        )}
        {state.matches('play.daytime.find') && (
          <div>
            <div className={'text-center text-5xl my-4'}>
              投票阶段
            </div>
            <div className={'text-center text-3xl my-4 leading-normal'}>
              {state.context.correct ? '狼人' : '村民'}请找出{state.context.correct ? '先知' : '狼人'}<br/>
              剩余 {state.context.leftSeconds} 秒
            </div>
          </div>
        )}
      </div>
    </>
  )
}