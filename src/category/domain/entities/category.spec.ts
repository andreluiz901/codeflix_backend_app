import { Category } from "./category"

describe('Category Unit Tests', () => {

  test('Construcotr of Category', () => {
    const createdAt = new Date()
    const category = new Category({
      name: 'Movie',
      description: 'some description',
      isActive: true,
      createdAt
    })

    expect(category.props).toStrictEqual({
      name: 'Movie',
      description: 'some description',
      isActive: true,
      createdAt
    })
  })
})