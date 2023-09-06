import React from 'react';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import MatchMediaMock from 'jest-matchmedia-mock';
import {
  KanbanBoard,
  KanbanBoardProps,
  KanbanItemWrapperProps,
  KanbanLaneGroupProps,
  KanbanLaneProps,
} from './';
import { KanbanCard } from './KanbanCard';
import { fireEvent, render, waitFor } from '@testing-library/react';
import mockDataSet from './mockdata.json';
import zhCN from './Locale/zh_CN';

Enzyme.configure({ adapter: new Adapter() });

let matchMedia: any;

class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
}

window.ResizeObserver = ResizeObserver;

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
  'data-testid'?: string;
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
    'data-testid': lane['data-testid'],
    dropzones: lane.dropzones.map((dz) => ({
      id: dz.sub_lane,
      displayName: dz.sub_lane,
    })),
    expandable: lane.dropzones.length > 1,
  })),
  loading: {},
};

const mockProps: KanbanBoardProps = {
  classNames: 'kanban-board-test-class',
  id: 'kanbanBoardTestId',
  items: [0, 1, 2, 3, 4, 5, 6, 7].map((index: number) => ({
    id: `${'item-' + index}`,
    index,
    'data-testid': `${'item-' + index}`,
    dropzoneId: 'Lane 1',
    selected: false,
    render: () => (
      <KanbanCard
        selectable
        data-testid={`${'test-kanbancard-' + index}`}
        header={<div>{'Item ' + index} header</div>}
        body={<div>{'Item ' + index} body</div>}
        expandedContent={<div>{'Item ' + index} expanded content</div>}
        hoverContent={<div>{'Item ' + index} hover content</div>}
      />
    ),
  })),
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
  style: { background: 'red' },
  'data-testid': 'test-kanbanboard',
};

describe('KanbanBoard', () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
  });

  test('Renders KanbanBoard without crashing', () => {
    const { container, getByTestId } = render(
      <KanbanBoard {...mockProps} data-testid="test-kanbanboard" />
    );
    const kanbanBoard = getByTestId('test-kanbanboard');
    expect(() => container).not.toThrowError();
    expect(kanbanBoard).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  test('Item drag and drop', () => {
    const { container, getByTestId } = render(<KanbanBoard {...mockProps} />);

    const draggableItem = getByTestId('test-kanbancard-0');
    const droppableZone = container.querySelector(
      '[data-rbd-droppable-id="LANE_1"]'
    );

    fireEvent.drag(draggableItem);
    fireEvent.drop(droppableZone);

    expect(droppableZone.innerHTML).toContain(draggableItem.innerHTML);
  });

  test('Renders KanbanBoard with custom classNames', () => {
    const { container } = render(<KanbanBoard {...mockProps} />);
    const kanbanBoard = container.querySelector('.kanban-board-test-class');

    expect(kanbanBoard).toBeTruthy();
  });

  test('Renders KanbanBoard with custom id', () => {
    const { container } = render(<KanbanBoard {...mockProps} />);
    const kanbanBoard = container.querySelector('#kanbanBoardTestId');

    expect(kanbanBoard).toBeTruthy();
  });

  test('Renders KanbanBoard with custom style', () => {
    const { getByTestId } = render(<KanbanBoard {...mockProps} />);
    const kanbanBoard = getByTestId('test-kanbanboard');

    expect(kanbanBoard.style.background).toBe('red');
  });

  test('Should apply laneGroupClassNames to KanbanLaneGroup', () => {
    const { container } = render(
      <KanbanBoard {...mockProps} laneGroupClassNames="test-lane-group" />
    );

    const laneGroupElement = container.querySelector('.test-lane-group');
    expect(laneGroupElement).toBeTruthy();
  });

  test('Should render with custom expandButtonAriaLabel', () => {
    const testExpandButtonAriaLabel = 'Custom expand';
    const { getByLabelText } = render(
      <KanbanBoard
        {...mockProps}
        expandButtonAriaLabel={testExpandButtonAriaLabel}
      />
    );

    const expandButton = getByLabelText(testExpandButtonAriaLabel);
    expect(expandButton).toBeTruthy();
  });

  test('Should render with custom collapseButtonAriaLabel', () => {
    const testExpandButtonAriaLabel = 'Custom expand';
    const testCollapseButtonAriaLabel = 'Custom collapse';
    const { getByLabelText } = render(
      <KanbanBoard
        {...mockProps}
        collapseButtonAriaLabel={testCollapseButtonAriaLabel}
        expandButtonAriaLabel={testExpandButtonAriaLabel}
      />
    );

    const expandButton = getByLabelText(testExpandButtonAriaLabel);
    fireEvent.click(expandButton);
    const collapseButton = getByLabelText(testCollapseButtonAriaLabel);
    expect(collapseButton).toBeTruthy();
  });

  test('Should render KanbanLaneLoader when loadingProps is provided', () => {
    const testLoadingProps = {
      lanesCount: 3,
      loading: true,
      loadingItem: <div data-testid="kanban-lane-loader">Loading...</div>,
    };

    const { getAllByTestId } = render(
      <KanbanBoard {...mockProps} loadingProps={testLoadingProps} />
    );

    const laneLoaders = getAllByTestId('kanban-lane-loader');
    expect(laneLoaders).toBeTruthy();
  });

  test('Should render KanbanLaneGroup when loadingProps is not provided', () => {
    const { container } = render(<KanbanBoard {...mockProps} />);

    const laneGroup = container.getElementsByClassName('lane-group')[0];
    expect(laneGroup).toBeTruthy();
  });

  test('Should render KanbanLaneGroup for each lane in the lanes prop', () => {
    const { getByTestId } = render(<KanbanBoard {...mockProps} />);

    const laneGroup1 = getByTestId('kanban-lane-1');
    const laneGroup2 = getByTestId('kanban-lane-2');

    expect(laneGroup1).toBeTruthy();
    expect(laneGroup2).toBeTruthy();
  });

  test('Should render with the provided locale', () => {
    const { getByLabelText } = render(
      <KanbanBoard {...mockProps} locale={zhCN} />
    );

    const expandButton = getByLabelText('扩大');
    expect(expandButton).toBeTruthy();
  });

  test('Renders lanes with correct titles', () => {
    const { getByTestId, getByText } = render(<KanbanBoard {...mockProps} />);

    mockProps.lanes.forEach(
      async (lane: KanbanLaneProps, index: number): Promise<void> => {
        await waitFor(() => getByText('Lane ' + index));
        const laneElement: HTMLElement = getByTestId(lane['data-testid']);
        expect(laneElement).toBeTruthy();
      }
    );
  });

  test('Renders items correctly', () => {
    const { getByTestId, getByText } = render(<KanbanBoard {...mockProps} />);

    mockProps.items.forEach(
      async (item: KanbanItemWrapperProps, index: number) => {
        await waitFor(() => getByText('Item ' + index));
        const itemElement: HTMLElement = getByTestId(item['data-testid']);
        expect(itemElement).toBeTruthy();
      }
    );
  });

  test('Toggles the expand button', () => {
    const { container, getByLabelText } = render(
      <KanbanBoard
        {...mockProps}
        collapseButtonAriaLabel="Collapse test"
        expandButtonAriaLabel="Expand test"
      />
    );

    const expandButton = getByLabelText('Expand test');

    expect(expandButton).toBeTruthy();

    fireEvent.click(expandButton);
    expect(container.querySelector('.expanded')).toBeTruthy();

    const collapseButton = getByLabelText('Collapse test');

    expect(collapseButton).toBeTruthy();

    fireEvent.click(collapseButton);
    expect(container.querySelector('.expanded')).toBeFalsy();
  });
});
