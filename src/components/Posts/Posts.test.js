const {
  render,
  screen,
  waitFor,
  fireEvent,
  act
} = require('@testing-library/react')
import Posts from './Posts'
import * as api from '../../middleware/api'

jest.mock('../../middleware/api')

describe('Posts', () => {
  beforeEach(() => jest.clearAllMocks())
  it('should render posts when api gets resolved', async () => {
    api.getPostsFromApi.mockResolvedValue([
      {
        userId: 1,
        id: 1,
        title: 'title 1',
        body: 'body 1'
      },
      {
        userId: 1,
        id: 2,
        title: 'title 2',
        body: 'body 2'
      }
    ])
    await act(async () => render(<Posts />))
    await waitFor(() => {
      screen.getByText('title 1')
    })
  })

  it('should render error message when api fails', async () => {
    api.getPostsFromApi.mockRejectedValue({})
    await act(async () => render(<Posts />))
    await waitFor(() => {
      screen.getByText('Error')
    })
  })

  it('search input should work', async () => {
    const setup = () => {
      const utils = render(<Posts />)
      const input = screen.getByPlaceholderText('Type to search')
      return {
        input,
        ...utils
      }
    }
    const { input } = setup()
    fireEvent.change(input, { target: { value: 'search term' } })
    expect(input.value).toBe('search term')
    fireEvent.change(input, { target: { value: '' } })
    expect(input.value).toBe('')
  })

  it('should render filtered result on search', async () => {
    api.getPostsFromApi.mockResolvedValue([
      {
        userId: 1,
        id: 1,
        title: 'new title 1',
        body: 'body 1'
      },
      {
        userId: 1,
        id: 2,
        title: 'new title 2',
        body: 'body 2'
      }
    ])
    const setup = () => {
      const utils = render(<Posts />)
      const input = screen.getByPlaceholderText('Type to search')
      return {
        input,
        ...utils
      }
    }
    const { input } = setup()

    fireEvent.change(input, { target: { value: 'new title 1' } })
    await waitFor(() => {
      screen.getByText('new title 1')
    })
  })

  it('should render empty page if result is not found', async () => {
    api.getPostsFromApi.mockResolvedValue([
      {
        userId: 1,
        id: 1,
        title: 'new title 1',
        body: 'body 1'
      },
      {
        userId: 1,
        id: 2,
        title: 'new title 2',
        body: 'body 2'
      }
    ])
    const setup = () => {
      const utils = render(<Posts />)
      const input = screen.getByPlaceholderText('Type to search')
      return {
        input,
        ...utils
      }
    }
    const { input } = setup()
    fireEvent.change(input, { target: { value: 'new title 3' } })
    await waitFor(() => {
      screen.getByText('No results found')
    })
  })
})
