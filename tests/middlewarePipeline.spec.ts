import { middlewarePipeline } from '../src/helpers/middlewarePipeline'
import { Middleware } from '../src/types/MiddlewareTypes'
import { RouteContext, RouteResolver } from '../src/types/VueTypes'

const executePipeline = (
  resolver: RouteResolver,
  middlwware: Middleware | Middleware[]
) => {
  // tslint:disable-next-line: no-object-literal-type-assertion
  const context = {
    next: resolver
  } as RouteContext
  const func = middlewarePipeline(context, middlwware) as RouteResolver
  func()
}

describe('Middleware Pipeline: Single Middleware', () => {
  it('executes middleware', () => {
    let middlewareExecuted = false
    const middleware: Middleware = (context: RouteContext) => {
      middlewareExecuted = true
      context.next()
    }
    const routeResolver: RouteResolver = () => {
      expect(middlewareExecuted).toBeTruthy()
    }
    executePipeline(routeResolver, middleware)
  })
})

describe('Middleware Pipeline: Multiple Middlewares', () => {
  it('executes all middlewares', () => {
    let counter = 0
    const middleware = (context: RouteContext) => {
      counter++
      context.next()
    }
    const middlewares: Middleware[] = [middleware, middleware, middleware]
    const routeResolver: RouteResolver = () => {
      expect(counter).toEqual(middlewares.length)
    }
    executePipeline(routeResolver, middlewares)
  })
})
