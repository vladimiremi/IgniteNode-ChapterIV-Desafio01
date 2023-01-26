import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("User Authenticate", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create session", async () => {
    const user: ICreateUserDTO = {
      email: "vladimir@test.com",
      password: "teste",
      name: "VladimirTest",
    };
    await createUserUseCase.execute(user);

    const session = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(session).toHaveProperty("token");
  });

  it("não deve ser capaz de criar sessão para e-mail inexistente", async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: "vladimir@test.com",
        password: "teste",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create sessions for users with an incorrect password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "vladimir@test.com",
        password: "teste",
        name: "VladimirTest",
      };
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrect",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
