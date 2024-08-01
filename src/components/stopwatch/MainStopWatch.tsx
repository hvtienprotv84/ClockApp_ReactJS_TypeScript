import React, { useRef } from "react";

import Timer from "./Timer";
import SplitTimer from "./SplitTimer";
import Actions from "./Actions";
import LogTable from "./LogTable";
import { ReduxStoreState } from "../../services/types";
import { bindActionCreators } from "redux";
import {
  updateTimer,
  resetTimer,
} from "../../services/redux/actions/timerActions";
import { resetLogs } from "../../services/redux/actions/logAction";
import { connect } from "react-redux";

type StoreProps = {
  currentTime: number;
};

type DispathProps = {
  updateTimer: (newTime: number) => void;
  resetTimer: () => void;
  resetLogs: () => void;
};

type Props = StoreProps & DispathProps;

let timer!: ReturnType<typeof setTimeout>;

const MainStopWatch = (props: Props) => {
  const timerStartRef = useRef(0);

  const startTimer = () => {
    const { currentTime } = props;
    timerStartRef.current = Date.now() - currentTime;

    timer = setInterval(() => {
      const { updateTimer } = props;
      updateTimer(Date.now() - timerStartRef.current);
    }, 1);
  };

  const stopTimer = () => {
    clearInterval(timer);
  };

  const resetTheTimer = () => {
    const { resetTimer, resetLogs } = props;
    resetTimer();
    resetLogs();
  };

  return (
    <div className="bg-black text-white min-h-svh flex flex-col items-center justify-start w-full pt-10 sm:pt-1">
      <div className="text-center">
        <Timer />
        <SplitTimer />
        <Actions
          handleStart={startTimer}
          handleStop={stopTimer}
          handleReset={resetTheTimer}
        />

        <main className="log-formatting-main max-w-lg mx-auto my-0">
          <LogTable />
        </main>
      </div>

          <div className="absolute flex flex-row top-[5px] lg:top-[60px] left-[10px] lg:left-[100px] items-center">
            <div className="bg-[#58bb71] lg:w-8 lg:h-8 w-4 h-4 rounded-full"></div>
            <p className="lg:ml-[10px] lg:text-xl ml-[5px] text-base">Bắt Đầu</p>
          </div>
          <div className="absolute flex flex-row top-[30px] lg:top-[100px] left-[10px] lg:left-[100px] items-center">
            <div className="bg-[#e92c55] lg:w-8 lg:h-8 w-4 h-4 rounded-full"></div>
            <p className="lg:ml-[10px] lg:text-xl ml-[5px] text-base">Tạm Dừng</p>
          </div>

    </div>
  );
};

const mapStateToProps = ({
  timer: { currentTime },
}: ReduxStoreState): StoreProps => ({
  currentTime,
});

const mapDispatchToProps = (dispatch: any): DispathProps => {
  return bindActionCreators(
    {
      updateTimer,
      resetTimer,
      resetLogs,
    },
    dispatch
  );
};

export default connect<StoreProps, DispathProps, ReduxStoreState>(
  mapStateToProps,
  mapDispatchToProps
)(MainStopWatch);
