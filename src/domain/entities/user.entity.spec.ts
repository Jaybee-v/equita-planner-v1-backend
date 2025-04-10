import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  const mockUserData = {
    id: 'test-id',
    email: 'test@example.com',
    password: 'password123',
    lastSeen: new Date('2023-01-01'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  describe('create', () => {
    it('should create a new user with all properties', () => {
      const user = UserEntity.create(
        mockUserData.id,
        mockUserData.email,
        mockUserData.password,
        mockUserData.lastSeen,
        mockUserData.createdAt,
        mockUserData.updatedAt,
      );

      expect(user.id).toBe(mockUserData.id);
      expect(user.email).toBe(mockUserData.email);
      expect(user.password).toBe(mockUserData.password);
      expect(user.lastSeen).toEqual(mockUserData.lastSeen);
      expect(user.createdAt).toEqual(mockUserData.createdAt);
      expect(user.updatedAt).toEqual(mockUserData.updatedAt);
    });

    it('should create a new user with default values when optional parameters are not provided', () => {
      const user = UserEntity.create(
        mockUserData.id,
        mockUserData.email,
        mockUserData.password,
      );

      expect(user.id).toBe(mockUserData.id);
      expect(user.email).toBe(mockUserData.email);
      expect(user.password).toBe(mockUserData.password);
      expect(user.lastSeen).toBeNull();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('email setter', () => {
    it('should update email when valid', () => {
      const user = UserEntity.create(
        mockUserData.id,
        mockUserData.email,
        mockUserData.password,
      );

      const newEmail = 'new@example.com';
      user.email = newEmail;

      expect(user.email).toBe(newEmail);
      expect(user.updatedAt).not.toEqual(mockUserData.updatedAt);
    });

    it('should throw error when email is invalid', () => {
      const user = UserEntity.create(
        mockUserData.id,
        mockUserData.email,
        mockUserData.password,
      );

      expect(() => {
        user.email = 'invalid-email';
      }).toThrow('Invalid email format');
    });
  });

  describe('password setter', () => {
    it('should update password when valid', () => {
      const user = UserEntity.create(
        mockUserData.id,
        mockUserData.email,
        mockUserData.password,
      );

      const newPassword = 'newpassword123';
      user.password = newPassword;

      expect(user.password).toBe(newPassword);
      expect(user.updatedAt).not.toEqual(mockUserData.updatedAt);
    });

    it('should throw error when password is too short', () => {
      const user = UserEntity.create(
        mockUserData.id,
        mockUserData.email,
        mockUserData.password,
      );

      expect(() => {
        user.password = 'short';
      }).toThrow('Password must be at least 8 characters long');
    });
  });

  describe('updateLastSeen', () => {
    it('should update lastSeen and updatedAt', () => {
      const user = UserEntity.create(
        mockUserData.id,
        mockUserData.email,
        mockUserData.password,
      );

      const beforeUpdate = new Date();
      user.updateLastSeen();
      const afterUpdate = new Date();

      expect(user.lastSeen).toBeInstanceOf(Date);
      expect(user.lastSeen!.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(user.lastSeen!.getTime()).toBeLessThanOrEqual(
        afterUpdate.getTime(),
      );
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(user.updatedAt.getTime()).toBeLessThanOrEqual(
        afterUpdate.getTime(),
      );
    });
  });

  describe('toJSON', () => {
    it('should return a JSON object with all public properties', () => {
      const user = UserEntity.create(
        mockUserData.id,
        mockUserData.email,
        mockUserData.password,
        mockUserData.lastSeen,
        mockUserData.createdAt,
        mockUserData.updatedAt,
      );

      const json = user.toJSON();

      expect(json).toEqual({
        id: mockUserData.id,
        email: mockUserData.email,
        lastSeen: mockUserData.lastSeen,
        createdAt: mockUserData.createdAt,
        updatedAt: mockUserData.updatedAt,
      });
    });
  });
});
