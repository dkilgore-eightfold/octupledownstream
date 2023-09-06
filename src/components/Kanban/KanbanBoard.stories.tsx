import React, { useEffect, useMemo } from 'react';
import { Stories } from '@storybook/addon-docs';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  KanbanBoard,
  KanbanItemWrapperProps,
  KanbanDragResult,
  KanbanLaneGroupProps,
} from './';
import { KanbanCard } from './KanbanCard';
import { useArgs } from '@storybook/client-api';
import mockDataSet from './mockdata.json';

export default {
  title: 'Kanban',
  parameters: {
    docs: {
      page: (): JSX.Element => (
        <main>
          <article>
            <section>
              <h1>Kanban</h1>
              <p>TBD</p>
            </section>
            <section>
              <Stories includePrimary title="" />
            </section>
          </article>
        </main>
      ),
    },
  },
} as ComponentMeta<typeof KanbanBoard>;

interface MyConstants {
  board: MyKanbanBoard[];
}

interface MyKanbanDropzone {
  sub_lane: string;
}

interface MyKanbanBoard {
  display_name: string;
  lane_id: string;
  dropzones: MyKanbanDropzone[];
  expandable: boolean;
}

type MyKanbanState = {
  board: KanbanLaneGroupProps[];
  loading: Record<string, boolean>;
};

interface MyData {
  constants: MyConstants;
}

/**
 * Spoofs an API call to get data.
 * @returns MyData
 */
const getMockData = (): MyData => {
  const content: string = JSON.stringify(mockDataSet) || '{}';
  return JSON.parse(content);
};

const mockLoadedState = getMockData();

const myState: MyKanbanState = {
  board: mockLoadedState.constants?.board?.map((lane) => ({
    title: lane.display_name,
    laneId: lane.lane_id,
    dropzones: lane.dropzones.map((dz) => ({
      id: dz.sub_lane,
      displayName: dz.sub_lane,
    })),
    expandable: lane.dropzones.length > 1,
  })),
  loading: {},
};

const Horizontal_Story: ComponentStory<typeof KanbanBoard> = (args) => {
  const [_, updateArgs] = useArgs(); // Specific to Storybook state management.
  const selected: KanbanItemWrapperProps[] = [];
  const items: KanbanItemWrapperProps[] = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6, 7].map((index: number) => ({
        id: `${'item-' + index}`,
        index,
        dropzoneId: 'Lane 1',
        'data-testid': `${'item-' + index}`,
        selected: false,
        render: () => (
          <KanbanCard
            checked={isSelected(items[index]?.id)}
            selectable
            header={<div>{'Item ' + index} header</div>}
            body={<div>{'Item ' + index} body</div>}
            expandedContent={<div>{'Item ' + index} expanded content</div>}
            hoverContent={<div>{'Item ' + index} hover content</div>}
            onCheckboxChange={(_encId, checked) => {
              items[index].selected = checked;
              if (checked) {
                selected.push(items[index]);
              } else {
                const selectedIndex = selected.findIndex(
                  (item) => item.id === items[index].id
                );
                if (selectedIndex !== -1) {
                  selected.splice(selectedIndex, 1);
                }
              }
              console.log(selected);
              updateArgsHandler();
            }}
          />
        ),
      })),
    []
  );

  useEffect(() => {
    updateArgsHandler();
  }, [items]);

  const isSelected = (encId: string): boolean =>
    selected.some((item) => item.id === encId);

  const updateArgsHandler = (): void => {
    updateArgs({
      items: items,
    });
  };

  return (
    <KanbanBoard
      {...args}
      items={items} // initialize locally the items.
      onDragEnd={(dropResult: KanbanDragResult) => {
        console.log(JSON.stringify(dropResult));
        const selectedItemId = dropResult.draggableId;
        const selectedStage = dropResult.destination?.droppableId;
        if (!selectedStage) {
          return;
        }
        const item = items.find((item) => item.id === selectedItemId);
        item.dropzoneId = selectedStage;
      }}
    />
  );
};

const Vertical_Story: ComponentStory<typeof KanbanBoard> = (args) => {
  const [_, updateArgs] = useArgs(); // Specific to Storybook state management.
  const selected: KanbanItemWrapperProps[] = [];
  const items: KanbanItemWrapperProps[] = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6, 7].map((index: number) => ({
        id: `${'item-' + index}`,
        index,
        dropzoneId: 'Lane 1',
        'data-testid': `${'item-' + index}`,
        selected: false,
        render: () => (
          <KanbanCard
            checked={isSelected(items[index]?.id)}
            selectable
            header={<div>{'Item ' + index} header</div>}
            body={<div>{'Item ' + index} body</div>}
            expandedContent={<div>{'Item ' + index} expanded content</div>}
            hoverContent={<div>{'Item ' + index} hover content</div>}
            onCheckboxChange={(_encId, checked) => {
              items[index].selected = checked;
              if (checked) {
                selected.push(items[index]);
              } else {
                const selectedIndex = selected.findIndex(
                  (item) => item.id === items[index].id
                );
                if (selectedIndex !== -1) {
                  selected.splice(selectedIndex, 1);
                }
              }
              console.log(selected);
              updateArgsHandler();
            }}
          />
        ),
      })),
    []
  );

  useEffect(() => {
    updateArgsHandler();
  }, [items]);

  const isSelected = (encId: string): boolean =>
    selected.some((item) => item.id === encId);

  const updateArgsHandler = (): void => {
    updateArgs({
      items: items,
    });
  };

  return (
    <KanbanBoard
      {...args}
      items={items} // initialize locally the items.
      onDragEnd={(dropResult: KanbanDragResult) => {
        console.log(JSON.stringify(dropResult));
        const selectedItemId = dropResult.draggableId;
        const selectedStage = dropResult.destination?.droppableId;
        if (!selectedStage) {
          return;
        }
        const item = items.find((item) => item.id === selectedItemId);
        item.dropzoneId = selectedStage;
      }}
    />
  );
};

export const Horizontal = Horizontal_Story.bind({});
export const Vertical = Vertical_Story.bind({});

// Storybook 6.5 using Webpack >= 5.76.0 automatically alphabetizes exports,
// this line ensures they are exported in the desired order.
// See https://www.npmjs.com/package/babel-plugin-named-exports-order
export const __namedExportsOrder = ['Horizontal', 'Vertical'];

const kanbanArgs: Object = {
  items: null,
  lanes: myState.board.map((lane: KanbanLaneGroupProps) => ({
    ...lane,
    laneStyles: {
      height: 'calc(100vh - 64px)', // Make sure to take into account header and/or footer height and insets when using viewport.
    },
    dropzones: lane.dropzones.map((dz) => ({
      ...dz,
    })),
    loadingProps: {
      loading: false,
      loadingItem: <KanbanCard loading />,
    },
  })),
  layout: 'vertical',
};

Horizontal.args = {
  ...kanbanArgs,
  lanes: myState.board.map((lane: KanbanLaneGroupProps) => ({
    ...lane,
    laneStyles: {
      height: 344,
    },
    dropzones: lane.dropzones.map((dz) => ({
      ...dz,
    })),
    loadingProps: {
      loading: false,
      loadingItem: <KanbanCard loading />,
    },
  })),
  layout: 'horizontal',
};

Vertical.args = {
  ...kanbanArgs,
};
