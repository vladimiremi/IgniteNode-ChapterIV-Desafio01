import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { OperationType } from "./CreateStatementController";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create the deposit and withdraw operations", async () => {
    const DEPOSIT = "deposit";
    const WITHDRAW = "withdraw";
    const user = await createUserUseCase.execute({
      email: "vladimir@test.com",
      name: "VladimirTest",
      password: "teste",
    });

    const deposit = await createStatementUseCase.execute({
      amount: 10,
      description: "Description test",
      type: DEPOSIT as OperationType,
      user_id: user.id,
    });

    const withdraw = await createStatementUseCase.execute({
      amount: 10,
      description: "Description test",
      type: WITHDRAW as OperationType,
      user_id: user.id,
    });

    expect(withdraw.type).toEqual(WITHDRAW);
    expect(deposit.type).toEqual(DEPOSIT);
  });

  it("should not be able to create withdrawal operations if there are not sufficient funds", async () => {
    await expect(async () => {
      const user = await createUserUseCase.execute({
        email: "vladimir@test.com",
        name: "VladimirTest",
        password: "teste",
      });

      await createStatementUseCase.execute({
        amount: 10,
        description: "Description test",
        type: "withdraw" as OperationType,
        user_id: user.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
