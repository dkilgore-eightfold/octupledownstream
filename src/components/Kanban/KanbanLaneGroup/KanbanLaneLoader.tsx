import React, { FC } from 'react';
import { KanbanBoardLoadingProps } from '../Kanban.types';
import { KanbanItemLoaders } from '../KanbanItemWrapper';
import { getArray, getLaneStyles } from '../utils';
import { Skeleton, SkeletonVariant } from '../../Skeleton';
import { Stack } from '../../Stack';
import { FadeIn } from '../../FadeIn';

import styles from './kanbanLaneGroup.module.scss';

export const KanbanLaneLoader: FC<KanbanBoardLoadingProps> = ({
  loadingItem,
  lanesCount,
}) => {
  const { width, background, padding } = getLaneStyles({});
  return (
    <>
      {getArray(lanesCount).map((laneIndex: number) => (
        <FadeIn key={laneIndex}>
          <div className={styles.laneGroup} style={{ width, background }}>
            <Stack
              align="center"
              classNames={styles.header}
              fullWidth
              justify="space-between"
            >
              <Skeleton
                animating
                height={16}
                width={100}
                variant={SkeletonVariant.Rounded}
              />
              <Skeleton animating height={16} width={16} />
            </Stack>
            <div className={styles.loaderLane}>
              <KanbanItemLoaders width={Number(width) - padding * 2}>
                {loadingItem}
              </KanbanItemLoaders>
            </div>
          </div>
        </FadeIn>
      ))}
    </>
  );
};
