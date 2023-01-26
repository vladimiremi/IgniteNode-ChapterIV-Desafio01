import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "vladimir@test.com",
      name: "VladimirTest",
      password: "teste",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create session to user already exists", async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        email: "vladimir@test.com",
        name: "VladimirTest",
        password: "teste",
      });

      await createUserUseCase.execute({
        email: "vladimir@test.com",
        name: "VladimirTest",
        password: "teste",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
