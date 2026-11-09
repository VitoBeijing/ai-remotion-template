import { Composition } from "remotion";
import { REGISTRY } from "./compositions";

// 所有模版统一在这里注册：compositions/index.ts（REGISTRY）由沉淀流程自动维护。
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {REGISTRY.map((t) => (
        <Composition
          key={t.id}
          id={t.id}
          component={t.Component}
          durationInFrames={t.durationInFrames}
          fps={t.fps}
          width={t.width}
          height={t.height}
          defaultProps={t.defaultProps}
        />
      ))}
    </>
  );
};
