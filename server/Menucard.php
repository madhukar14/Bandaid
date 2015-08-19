<?php
class Menucard{
	public $name;
	public $description;
	public $sizes = array();
	public $price = array();
	
	public function setName($name){
		$this->name = $name;
	}
	
	public function setDescription($desc){
		$this->description = $desc;
	}
	
	public function addSize($size){
		array_push($this->sizes, $size);
	}
	
	public function setSizes($sizes){
		$this->sizes = $sizes;
	}
	
	public function addSizes($sizes){
		foreach($sizes as $item){
			addSize($item);
		}
	}
	
	public function addSizeAndPrice($size,$price){
		$this->addSize($size);
		$this->price[$size] = $price;
	}
}
?>