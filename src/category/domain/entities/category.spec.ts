import UniqueEntityId from "../../../@seedwork/domain/unique-entity-id.vo"
import { Category, CategoryProperties } from "./category"
import { omit } from "lodash"

describe('Category Unit Tests', () => {

  test('Constructor of Category', () => {

    let category = new Category({
      name: 'Movie',
    })

    let props = omit(category.props, 'createdAt')

    expect(props).toStrictEqual({
      name: 'Movie',
      description: null,
      isActive: true
    })
    expect(category.props.createdAt).toBeInstanceOf(Date)

    let createdAt = new Date()
    category = new Category({
      name: 'Movie',
      description: 'some description',
      isActive: false,
      createdAt
    })
    expect(category.props).toStrictEqual({
      name: 'Movie',
      description: 'some description',
      isActive: false,
      createdAt
    })


    category = new Category({
      name: 'Movie',
      description: 'other description',
    })
    expect(category.props).toMatchObject({
      name: 'Movie',
      description: 'other description',
    })


    category = new Category({
      name: 'Movie',
      isActive: true,
    })
    expect(category.props).toMatchObject({
      name: 'Movie',
      isActive: true,
    })


    createdAt = new Date()
    category = new Category({
      name: 'Movie',
      createdAt,
    })
    expect(category.props).toMatchObject({
      name: 'Movie',
      createdAt
    })
  })

  test('id field', () => {

    type CategoryData = { props: CategoryProperties, id?: UniqueEntityId }
    const data: CategoryData[] = [
      { props: { name: 'Movie1' } },
      { props: { name: 'Movie1' }, id: null },
      { props: { name: 'Movie1' }, id: undefined },
      { props: { name: 'Movie1' }, id: new UniqueEntityId() },
    ]

    data.forEach(i => {
      const category = new Category(i.props, i.id)
      expect(category.id).not.toBeNull()
      expect(category.id).toBeInstanceOf(UniqueEntityId)
    })

  })

  test('getter of name field', () => {
    const category = new Category({ name: 'Movie' })
    expect(category.name).toBe('Movie')
  })

  test('getter and setter of description field', () => {
    let category = new Category({ name: 'Movie', description: 'some description' })
    expect(category.description).toBe('some description')

    category = new Category({ name: 'Movie' })
    expect(category.description).toBe(null)

    category = new Category({ name: 'Movie' })
    category['description'] = 'other description'
    expect(category.description).toBe('other description')

    category['description'] = undefined
    expect(category.description).toBeNull()

    category['description'] = null
    expect(category.description).toBeNull()
  })

  test('getter and setter of isActive prop', () => {
    let category = new Category({ name: 'Movie' })
    expect(category.isActive).toBeTruthy()

    category = new Category({ name: 'Movie', isActive: true })
    expect(category.isActive).toBeTruthy()

    category = new Category({ name: 'Movie', isActive: false })
    expect(category.isActive).toBeFalsy()
  })

  test('getter of createdAt prop', () => {
    let category = new Category({ name: 'Movie' })
    expect(category.createdAt).toBeInstanceOf(Date)

    let createdAt = new Date()
    category = new Category({ name: 'Movie', createdAt })
    expect(category.createdAt).toBe(createdAt)
  })
})