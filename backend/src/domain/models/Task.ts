export interface TaskProps {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Task {
  private props: TaskProps;

  constructor(props: TaskProps) {
    this.props = {
      ...props,
      updatedAt: new Date(),
    };
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get completed() {
    return this.props.completed;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  complete() {
    this.props.completed = true;
    this.props.updatedAt = new Date();
  }

  uncomplete() {
    this.props.completed = false;
    this.props.updatedAt = new Date();
  }

  updateTitle(newTitle: string) {
    this.props.title = newTitle;
    this.props.updatedAt = new Date();
  }

  toPrimitives() {
    return { ...this.props };
  }
}
