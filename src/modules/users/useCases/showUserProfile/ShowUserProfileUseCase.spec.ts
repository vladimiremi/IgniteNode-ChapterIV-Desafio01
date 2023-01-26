import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show the users info", async () => {
    const user: ICreateUserDTO = {
      email: "vladimir@test.com",
      password: "teste",
      name: "VladimirTest",
    };
    const newUser = await createUserUseCase.execute(user);

    const profile = await showUserProfileUseCase.execute(newUser.id);

    expect(profile).toHaveProperty("id");
    expect(profile).toHaveProperty("email");
    expect(profile).toHaveProperty("name");
  });

  it("should not be able to show the information if the user does not exist", async () => {
    await expect(async () => {
      await showUserProfileUseCase.execute("id_incorrect");
    }).rejects.toBeInstanceOf(AppError);
  });
});
