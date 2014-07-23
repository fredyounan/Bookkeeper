<?php namespace Bookkeeper\Transformer\Rules;

interface RuleConditionInterface {

    /**
     * Perform a test on the given subject
     *
     * @param $value
     * @param $subject
     * @return mixed
     */
    public function test($field, $value);

} 