import React from 'react';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import MatchMediaMock from 'jest-matchmedia-mock';
import { KanbanCard } from './';
import { fireEvent, render } from '@testing-library/react';
import zhCN from '../Locale/zh_CN';

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

jest.mock('react-use-measure', () => jest.fn(() => [[{ height: 100 }], {}]));
jest.mock('@react-spring/web', () => ({
  a: { div: 'div' },
  useSpring: jest.fn(() => ({ height: 0, opacity: 0, marginTop: 0 })),
}));

describe('KanbanCard', () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
  });

  test('Renders Basic KanbanCard without crashing', () => {
    const { container, getByTestId } = render(
      <KanbanCard
        data-testid="test-kanbancard"
        header={<div>header</div>}
        body={<div>body</div>}
        expandedContent={<div>expanded content</div>}
        hoverContent={<div>hover content</div>}
      />
    );
    const kanbanCard = getByTestId('test-kanbancard');
    expect(() => container).not.toThrowError();
    expect(kanbanCard).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  test('Should be selectable, support checkboxProps, and handle checkbox change', async () => {
    const onCheckboxChangeMock = jest.fn();
    const { container } = render(
      <KanbanCard
        selectable
        checkboxProps={{ classNames: 'test-checkbox' }}
        onCheckboxChange={onCheckboxChangeMock}
      />
    );

    const checkbox = container.querySelector('.test-checkbox');
    expect(checkbox).toBeTruthy();
    fireEvent.click(checkbox.firstElementChild);

    expect(onCheckboxChangeMock).toHaveBeenCalledTimes(1);
  });

  test('Should render as checked', () => {
    const { getByLabelText } = render(<KanbanCard checked selectable />);

    const checkbox = getByLabelText('Deselect card');
    expect(checkbox).toBeTruthy();
  });

  test('Renders KanbanCard with custom classNames', () => {
    const { container } = render(
      <KanbanCard classNames="kanban-card-test-class" />
    );
    const kanbanCard = container.querySelector('.kanban-card-test-class');

    expect(kanbanCard).toBeTruthy();
  });

  test('Renders KanbanCard with header and custom headerClassNames', () => {
    const { container } = render(
      <KanbanCard
        header={<div>My header</div>}
        headerClassNames="kanban-card-test-header-class"
      />
    );
    const kanbanCardHeader = container.querySelector(
      '.kanban-card-test-header-class'
    );

    expect(kanbanCardHeader).toBeTruthy();
  });

  test('Renders KanbanCard with loading prop', () => {
    const { container } = render(<KanbanCard loading />);
    const kanbanCardSkeletons = container.querySelectorAll('.skeleton');

    expect(kanbanCardSkeletons).toBeTruthy();
  });

  test('Renders KanbanCard with loading and loadingContent props', () => {
    const { getByTestId } = render(
      <KanbanCard
        loading
        loadingContent={<div data-testid="test-loading">...loading</div>}
      />
    );
    const kanbanCardLoadingContent = getByTestId('test-loading');

    expect(kanbanCardLoadingContent).toBeTruthy();
  });

  test('Handles loading change', async () => {
    const onLoadingChangeMock = jest.fn();
    render(<KanbanCard loading onLoadingChange={onLoadingChangeMock} />);

    expect(onLoadingChangeMock).toHaveBeenCalledTimes(1);
  });

  test('Should render with custom expandButtonAriaLabel', () => {
    const testExpandButtonAriaLabel = 'Custom expand';
    const { getByLabelText } = render(
      <KanbanCard expandButtonAriaLabel={testExpandButtonAriaLabel} />
    );

    const expandButton = getByLabelText(testExpandButtonAriaLabel);
    expect(expandButton).toBeTruthy();
  });

  test('Should render with custom collapseButtonAriaLabel', () => {
    const testExpandButtonAriaLabel = 'Custom expand';
    const testCollapseButtonAriaLabel = 'Custom collapse';
    const { getByLabelText } = render(
      <KanbanCard
        collapseButtonAriaLabel={testCollapseButtonAriaLabel}
        expandButtonAriaLabel={testExpandButtonAriaLabel}
      />
    );

    const expandButton = getByLabelText(testExpandButtonAriaLabel);
    fireEvent.click(expandButton);
    const collapseButton = getByLabelText(testCollapseButtonAriaLabel);
    expect(collapseButton).toBeTruthy();
  });

  test('Should render with custom selectCardAriaLabel', () => {
    const testSelectCardAriaLabel = 'Custom select';
    const { getByLabelText } = render(
      <KanbanCard selectable selectCardAriaLabel={testSelectCardAriaLabel} />
    );

    const checkbox = getByLabelText(testSelectCardAriaLabel);
    expect(checkbox).toBeTruthy();
  });

  test('Should render with custom deselectCardAriaLabel', async () => {
    const testDeselectCardAriaLabel = 'Custom deselect';
    const { getByLabelText } = render(
      <KanbanCard
        checked
        selectable
        deselectCardAriaLabel={testDeselectCardAriaLabel}
      />
    );

    const selected = getByLabelText(testDeselectCardAriaLabel);
    expect(selected).toBeTruthy();
  });

  test('Should render with the provided locale', () => {
    const { getByLabelText } = render(<KanbanCard selectable locale={zhCN} />);

    const checkbox = getByLabelText('选择卡');
    expect(checkbox).toBeTruthy();
  });

  test('Should be hoverable', () => {
    const { getByTestId } = render(
      <KanbanCard
        data-testid="test-kanbancard"
        hoverable
        hoverContent={<div data-testid="test-hover-content">Hover content</div>}
      />
    );

    const kanbanCard = getByTestId('test-kanbancard');

    fireEvent.mouseOver(kanbanCard);
    const hoverContent = getByTestId('test-hover-content');
    expect(hoverContent).toBeTruthy();
  });

  test('Should not be hoverable', () => {
    const { container, getByTestId } = render(
      <KanbanCard
        data-testid="test-kanbancard"
        hoverable={false}
        hoverContent={<div className="hover-content">Hover content</div>}
      />
    );

    const kanbanCard = getByTestId('test-kanbancard');

    fireEvent.mouseOver(kanbanCard);
    expect(container.querySelector('hover-content')).toBeFalsy();
  });

  test('Handles updateDimension', async () => {
    const updateDimensionMock = jest.fn();
    const { getByTestId } = render(
      <KanbanCard
        data-testid="test-kanbancard"
        hoverable
        hoverContent={<div className="hover-content">Hover content</div>}
        updateDimension={updateDimensionMock}
      />
    );

    const kanbanCard = getByTestId('test-kanbancard');

    fireEvent.mouseOver(kanbanCard);
    expect(updateDimensionMock).toHaveBeenCalledTimes(1);
  });

  test('Should support expandable, expandButtonProps, and expandedContent', () => {
    const { container, getByTestId, getByLabelText } = render(
      <KanbanCard
        expandable
        expandButtonProps={{ classNames: 'test-expand-button' }}
        expandedContent={
          <div data-testid="test-expandable-content">Expandable content</div>
        }
      />
    );

    const expandButton = getByLabelText('Expand');
    expect(container.querySelector('.test-expand-button')).toBeTruthy();

    fireEvent.click(expandButton);
    const expandableContent = getByTestId('test-expandable-content');
    expect(expandableContent).toBeTruthy();
  });
});
