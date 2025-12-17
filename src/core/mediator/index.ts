import { AppError } from "../common/app-error";
import { Result } from "../common/result";
import { container } from "../di";

export interface IRequest<TResponse> {
    _responseType?: TResponse;
}

export interface IRequestHandler<TRequest extends IRequest<any>, TResponse> {
    handle(request: TRequest): Promise<Result<TResponse>>;
}

export abstract class BaseRequest<TResponse> implements IRequest<TResponse> {
    declare _responseType?: TResponse;
}

type Constructor<T> = new (...args: any[]) => T;

export class Mediator {
    private handlerMap = new Map<string, string>();

    public register<TRequest extends IRequest<TResponse>, TResponse>(
        requestType: Constructor<TRequest>,
        handlerClass: Constructor<IRequestHandler<TRequest, TResponse>>,
        dependencies: string[] = []
    ) {
        container.registerTransient(handlerClass.name, handlerClass, dependencies);
        this.handlerMap.set(requestType.name, handlerClass.name);
    }

    public async send<TResponse>(request: IRequest<TResponse>): Promise<Result<TResponse>> {
        const requestName = request.constructor.name;
        const handlerKey = this.handlerMap.get(requestName);

        if (!handlerKey) {
            return Result.fail(AppError.critical(`No handler registered for ${requestName}`));
        }

        try {
            const handler = container.resolve<IRequestHandler<any, TResponse>>(handlerKey);
            return handler.handle(request);
        } catch (e: any) {
            return Result.fail(AppError.critical(`Failed to resolve handler: ${e.message}`));
        }
    }
}

export const mediator = new Mediator();
