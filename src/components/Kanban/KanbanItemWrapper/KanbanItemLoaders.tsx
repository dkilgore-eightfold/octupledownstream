import React, { FC } from 'react';
import { Card, CardSize } from '../../Card';
import { KanbanItemLoadersProps } from '../Kanban.types';
import { getArray } from '../utils';

import styles from './kanbanItemLoaders.module.scss';

const ITEMS_TO_SHOW: number = 2;

export const KanbanItemLoaders: FC<KanbanItemLoadersProps> = ({
  children,
  bordered = false,
  width,
}) => (
  <div className={styles.loaderOuter} style={{ width }}>
    {getArray(ITEMS_TO_SHOW).map((i) => (
      <Card
        key={i}
        classNames={styles.item}
        bordered={bordered}
        size={CardSize.Small}
      >
        {children}
      </Card>
    ))}
  </div>
);
