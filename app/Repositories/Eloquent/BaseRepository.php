<?php

namespace App\Repositories\Eloquent;

use App\Repositories\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class BaseRepository implements BaseRepositoryInterface
{
    /**
     * @var Model
     */
    protected $model;

    /**
     * BaseRepository constructor.
     *
     * @param Model $model
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $attributes
     * @return Model
     */
    public function create(array $attributes): Model
    {
        return $this->model->create($attributes);
    }

    /**
     * @param $id
     * @return Model|null
     */
    public function find($id): ?Model
    {
        return $this->model->find($id);
    }

    /**
     * @param Model $model
     * @param array $attributes
     * @return Model
     */
    public function update(Model $model, array $attributes): Model
    {
        $model->update($attributes);
        return $model;
    }

    /**
     * @param Model $model
     * @return bool
     */
    public function delete(Model $model): bool
    {
        return $model->delete();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function all()
    {
        return $this->model->all();
    }

    /**
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate(int $perPage = 15)
    {
        return $this->model->paginate($perPage);
    }

    /**
     * @return Model
     */
    public function getModel(): Model
    {
        return $this->model;
    }
}
