<?php

namespace App\Queries;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BaseQuery
{
    protected $builder;
    protected $request;

    public function __construct(Builder|Relation $builder, Request $request)
    {
        $this->builder = $builder;
        $this->request = $request;
    }

    public static function for(Builder|Relation $builder, Request $request)
    {
        return new static($builder, $request);
    }

    public function handle()
    {
        $this->applySearch()
            ->applyFilters()
            ->applySorts();

        return $this->builder;
    }

    public function paginate(int $defaultPerPage = 10)
    {
        $perPage = $this->request->input('per_page', $defaultPerPage);
        return $this->handle()->paginate($perPage);
    }

    protected function applySearch(): self
    {
        if ($this->request->has('search') && !empty($this->builder->getModel()->searchable)) {
            $searchableFields = $this->builder->getModel()->searchable;
            $searchTerm = $this->request->input('search');

            $this->builder->where(function (Builder $query) use ($searchableFields, $searchTerm) {
                foreach ($searchableFields as $field) {
                    $query->orWhere($field, 'LIKE', "%{$searchTerm}%");
                }
            });
        }

        return $this;
    }

    protected function applyFilters(): self
    {
        if ($this->request->has('filter') && is_array($this->request->input('filter'))) {
            $filterableFields = $this->builder->getModel()->filterable ?? [];
            foreach ($this->request->input('filter') as $field => $value) {
                if (in_array($field, $filterableFields) && !empty($value)) {
                    $this->builder->where($field, $value);
                }
            }
        }

        return $this;
    }

    protected function applySorts(): self
    {
        if ($this->request->has('sort')) {
            $sortableFields = $this->builder->getModel()->sortable ?? [];
            $sorts = explode(',', $this->request->input('sort'));

            foreach ($sorts as $sort) {
                $direction = Str::startsWith($sort, '-') ? 'desc' : 'asc';
                $field = ltrim($sort, '-');

                if (in_array($field, $sortableFields)) {
                    $this->builder->orderBy($field, $direction);
                }
            }
        }

        return $this;
    }
}
