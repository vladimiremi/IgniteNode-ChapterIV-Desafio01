import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUserRepository
    );
  });

  it("should be able to list the deposit and withdraw operations", async () => {
    const DEPOSIT = "deposit";
    const WITHDRAW = "withdraw";
    const user = await createUserUseCase.execute({
      email: "vladimir@test.com",
      name: "VladimirTest",
      password: "teste",
    });

    await createStatementUseCase.execute({
      amount: 10,
      description: "Description test",
      type: DEPOSIT as OperationType,
      user_id: user.id,
    });

    await createStatementUseCase.execute({
      amount: 10,
      description: "Description test",
      type: WITHDRAW as OperationType,
      user_id: user.id,
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance.statement.length).toEqual(2);
  });

  it("should no be able to list the deposit and withdraw operations if user does not exist", async () => {
    await expect(async () => {
      await getBalanceUseCase.execute({ user_id: "invalid_id" });
    }).rejects.toBeInstanceOf(AppError);
  });
});
