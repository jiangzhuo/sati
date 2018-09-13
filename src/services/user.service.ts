import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { __ as t } from 'i18n';
import { EntityManager, Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { User } from '../entities/user.entity';
import { JwtReply } from '../interfaces/jwt.interface';
import { CreateUserInput, UpdateUserInput, UserInfoData } from '../interfaces/user.interface';
import { CryptoUtil } from '../utils/crypto.util';

@Injectable()
export class UserService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @Inject(CryptoUtil) private readonly cryptoUtil: CryptoUtil,
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService
    ) {
    }

    /**
     * Cteate a user
     *
     * @param createUserInput
     */
    async createUser(createUserInput: CreateUserInput): Promise<void> {
        // await this.checkUsernameExist(createUserInput.nickname);
        createUserInput.password = await this.cryptoUtil.encryptPassword(createUserInput.password);
        const user = await this.userRepo.save(this.userRepo.create(createUserInput));
    }

    /**
     * Update user's information
     *
     * @param id The specified user id
     * @param updateUserInput The information to be update
     */
    async updateUserInfo(id: string, updateUserInput: UpdateUserInput): Promise<void> {
        const user = await this.userRepo.findOne(id);
        if (updateUserInput.nickname) {
            this.userRepo.update(user.id, { nickname: updateUserInput.nickname });
        }
        if (updateUserInput.password) {
            const newPassword = await this.cryptoUtil.encryptPassword(updateUserInput.password);
            this.userRepo.update(user.id, { password: newPassword });
        }
    }

    /**
     * Ordinary user login
     *
     * @param mobile
     * @param password password
     */
    async login(mobile: string, password: string): Promise<JwtReply> {
        const user = await this.userRepo.findOne({ mobile });
        if (!await this.cryptoUtil.checkPassword(password, user.password)) {
            throw new HttpException(t('invalid password'), 406);
        }

        return this.authService.createToken({ id: user.id.toString() });
    }

    /**
     * Ordinary user registration
     *
     * @param createUserInput
     */
    async register(createUserInput: CreateUserInput): Promise<void> {
        createUserInput.status = 0;
        this.createUser(createUserInput);
    }

    /**
     * Query users by ID
     *
     * @param id The specified user id
     */
    async findOneById(id: string): Promise<User> {
        const exist = await this.userRepo.findOne(id);
        if (!exist) {
            throw new HttpException(t('User does not exist'), 404);
        }
        return exist;
    }

    async findUserInfoById(id: string | string[]): Promise<UserInfoData | UserInfoData[]> {
        if (id instanceof Array) {
            const userInfoData: UserInfoData[] = [];
            const users = await this.userRepo.find({ where: { id: { $in: id } } });
            for (const user of users) {
                (userInfoData as UserInfoData[]).push(this.refactorUserData(user));
            }
            return userInfoData;
        } else {
            const user = await this.userRepo.findOne(id);
            return this.refactorUserData(user);
        }
    }

    /**
     * Refactor the user information data
     *
     * @param user The user object
     */
    private refactorUserData(user: User) {
        return {
            userId: user.id.toString(),
            mobile: user.mobile,
            nickname: user.nickname,
            status: user.status,
            updateTime: user.updateTime
        };
    }
}
