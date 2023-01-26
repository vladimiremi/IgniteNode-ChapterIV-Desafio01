import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperation: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    getStatementOperation = new GetStatementOperationUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to show the operation", async () => {
    const DEPOSIT = "deposit";
    const user = await createUserUseCase.execute({
      email: "vladimir@test.com",
      name: "VladimirTest",
      password: "teste",
    });

    const operation = await createStatementUseCase.execute({
      amount: 10,
      description: "Description test",
      type: DEPOSIT as OperationType,
      user_id: user.id,
    });

    const balance = await getStatementOperation.execute({
      statement_id: operation.id,
      user_id: user.id,
    });

    expect(balance).toHaveProperty("id");
  });

  it("should not be able to show the operation if a user does not exist", async () => {
    await expect(async () => {
      const DEPOSIT = "deposit";
      const user = await createUserUseCase.execute({
        email: "vladimir@test.com",
        name: "VladimirTest",
        password: "teste",
      });

      const operation = await createStatementUseCase.execute({
        amount: 10,
        description: "Description test",
        type: DEPOSIT as OperationType,
        user_id: user.id,
      });

      await getStatementOperation.execute({
        statement_id: operation.id,
        user_id: "invalid_id",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
