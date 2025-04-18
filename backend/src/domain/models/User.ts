export interface UserProps {
  id: string;
  email: string;
  createdAt: Date;
}

export class User {
  constructor(private props: UserProps) {}

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  toPrimitives() {
    return { ...this.props };
  }
}
